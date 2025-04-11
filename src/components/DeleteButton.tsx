"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeleteButton = ({ id }: { id: string }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.isAdmin;
  console.log(id);

  if (!isAdmin) return null;

  async function handleClick() {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      router.push("/menu");
      toast.success(`Product id:${id}  deleted successfully`);
    } else {
      const data = await res.json();
      toast.error(data.message);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-red-400 p-2 rounded-full absolute top-4 right-4 text-amber-50"
    >
      <Image src="/trash.png" alt="" width={20} height={20} />
    </button>
  );
};

export default DeleteButton;

// // Previous code snippet
// "use client";

// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";

// const DeleteButton = ({ id, route }: { id: string; route: string }) => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const isAdmin = session?.user?.isAdmin;
//   console.log(id);

//   if (!isAdmin) return null;

//   async function handleClick() {
//     const res = await fetch(`/api/${route}/${id}`, {
//       method: "DELETE",
//     });

//     if (res.status === 200) {
//       if (route === "orders") {
//         router.push("/orders");
//         toast.success(`id:${id}  deleted successfully`);
//         return;
//       }
//       router.push("/menu");
//       toast.success(`id:${id}  deleted successfully`);
//     } else {
//       const data = await res.json();
//       toast.error(data.message);
//     }
//   }

//   let classname;
//   if (route === "orders") {
//     classname = "bg-red-400 p-2 rounded-full  text-amber-50";
//   } else {
//     classname =
//       "bg-red-400 p-2 rounded-full absolute top-4 right-4 text-amber-50";
//   }

//   return (
//     <button onClick={handleClick} className={classname}>
//       <Image src="/trash.png" alt="" width={20} height={20} />
//     </button>
//   );
// };

// export default DeleteButton;
