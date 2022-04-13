import {useEffect} from "react";
import Head from "next/head";
import {useRouter} from "next/router";
import type {NextPage} from "next";
import type {SafeInfo} from "@gnosis.pm/safe-react-gateway-sdk";

import {useAppDispatch, useAppSelector} from "store";
import {safeInfoState, setSafeInfo} from "store/safeInfoSlice";
import {initSafeInfoService, SAFE_INFO_EVENTS} from "services/SafeInfoService";
import {isString} from "utils/strings";
import {parsePrefixedAddress} from "utils/addresses";
import SafeInfo from "../../components/common/SafeInfo";

const Home: NextPage = () => {
  const router = useRouter();
  const { safeAddress } = router.query;
  const dispatch = useAppDispatch()

  const safeInfo = useAppSelector(safeInfoState);

  useEffect(() => {
    if (!isString(safeAddress)) return

    const {address} = parsePrefixedAddress(safeAddress)

    const eventEmitter = initSafeInfoService("4", address)

    const handleSuccess = (data: SafeInfo) => {
      dispatch(setSafeInfo(data))
    }
    const handleError = (error: Error) => {
      console.error("Error loading Safe info", error)
    }

    eventEmitter.addListener(SAFE_INFO_EVENTS.SUCCESS, handleSuccess)
    eventEmitter.addListener(SAFE_INFO_EVENTS.ERROR, handleError)

    return () => {
      eventEmitter.removeAllListeners()
    }
  }, [dispatch, safeAddress])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SafeInfo />

      <main>Hello Balances of {safeAddress}</main>
      <pre>{JSON.stringify(safeInfo, null, 2)}</pre>
    </div>
  );
};

export default Home;