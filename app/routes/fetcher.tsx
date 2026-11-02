import { useContext, useEffect, useState } from "react";
import { UNSAFE_DataRouterContext, useFetcher } from "react-router";

export default function FetcherPage() {
  const { load, data } = useFetcher<{ token: string }>();
  const token = data?.token ?? null;

  useEffect(() => {
    void load("/token");
  }, [load]);

  const [tokenSeenByEffect, setTokenSeenByEffect] = useState<string | null>(null);
  useEffect(() => {
    console.log(`effect ran, token=${token}`);
    setTokenSeenByEffect(token);
  }, [token]);

  // Stands in for any unrelated update that ends with "no change", for example
  // a store subscription that sets the same value again. It lands after the
  // router has stored the fetcher data, but before the router's transition render.
  const router = useContext(UNSAFE_DataRouterContext)?.router;
  const [, setTick] = useState(0);
  useEffect(
    () =>
      router?.subscribe(() => {
        setTick(1);
        setTick(0);
      }),
    [router],
  );

  return (
    <>
      <p>
        token rendered: <output id="rendered">{token ?? "none"}</output>
      </p>
      <p>
        token seen by effect: <output id="effect">{tokenSeenByEffect ?? "none"}</output>
      </p>
    </>
  );
}
