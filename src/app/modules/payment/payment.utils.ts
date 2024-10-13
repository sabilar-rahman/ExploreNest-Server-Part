import axios from 'axios'

const verifyPayment = async (transactionId: string) => {
  const response = await axios.get(
    `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php`,
    {
      params: {
        store_id: 'aamarpaytest',
        signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
        type: 'json',
        request_id: transactionId,
      },
    },
  )
  return response?.data
}

export default verifyPayment