export default function SignedNumber({ value }: { value: number }) {
  return value > 0 ? (
    <span className="text-green-500">+{value}</span>
  ) : (
    <span className="text-red-500">{value}</span>
  )
}
