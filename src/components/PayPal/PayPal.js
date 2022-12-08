import { useRef } from "react";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function PayPal(props) {
  const paypal = useRef();
  const [info, setInfo] = useState([]);
  const [input, setInput] = useState(props.value);
  const [from, setFrom] = useState("vnd");
  const [to, setTo] = useState("usd");
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);

  const convertUSD = async () => {
    await axios
      .get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}.json`
      )
      .then((res) => {
        setOutput((input * res.data[from][to]).toFixed(2));
      });
  };

  // Function to convert the currency

  useEffect(() => {
    convertUSD();
    console.log(output);
  }, []);
  window.paypal
    .Buttons({
      createOrder: (data, actions, err) => {
        console.log(`${output}`);
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: "Payment",
              amount: {
                currency_code: "USD",
                value: `${output}`,
              },
            },
          ],
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log("success order: " + order);
        console.log(order);
        props.submit();
      },
      onError: (err) => {
        console.log(err);
      },
    })
    .render(paypal.current);
  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
}

export default PayPal;
