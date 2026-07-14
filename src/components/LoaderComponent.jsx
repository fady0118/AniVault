export default function LoaderComponent ({ type }) {
  console.log({type})
  return (
    <>
      {type==="progress" ? (
        <div className='loader-progress'></div>
      ) : (
        <div className='loader'></div>
      )}
    </>
  )
}
