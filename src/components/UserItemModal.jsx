export default function UserItemModal({ data, setShowUserItemModal }) {
  return (
    <div className="z-50 fixed top-0 left-[-2.5vw] w-screen h-screen backdrop-blur-lg">
      <div className="fixed top-1/2 left-1/2 -translate-1/2 w-[90%] sm:w-3/4 md:w-2/3 lg:w-1/2 rounded-md p-4 box-colors">
        <button onClick={() => setShowUserItemModal(false)} className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2 bg-transparent" aria-label="Close authentication modal">
          ✕
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-start gap-3">
            <img src={data.images.webp.large_image_url || data.images.webp.image_url} className="w-1/4 min-w-20 max-w-32 aspect-2/3 rounded-sm object-cover" alt="" />
            <div className="w-3/4 mr-8 text-justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatem dolor perferendis consequuntur doloribus quasi dolorem officia cumque laudantium quae, quidem minima animi
              laboriosam deleniti unde, voluptates odio obcaecati. Mollitia?
            </div>
          </div>
          <div className="text-rose-400">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ex sit aliquid asperiores necessitatibus dolor nesciunt neque, dolorem harum, qui praesentium mollitia inventore. Earum
              tempore fugit odit facilis. Blanditiis, esse?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
