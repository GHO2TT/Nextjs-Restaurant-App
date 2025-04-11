"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Option = {
  title: string;
  additionalPrice: number;
};

const AddProductpage = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [optionsDetails, setOptionsDetails] = useState({
    title: "",
    additionalPrice: 0,
  });
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.isAdmin;
  // const user = session?.user;

  useEffect(() => {
    if (status === "loading") return;

    if (!isAdmin) {
      toast.error("Not an admin");
      router.push("/");
    } else {
      toast.success("Welcome admin");
    }
  }, [isAdmin, status, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const price = Number(formData.get("price"));
    const file = formData.get("image") as File;
    const category = formData.get("category");
    const isFeatured = formData.get("isFeatured") === "true";

    if (!title || !description || !price || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isAdmin) {
      router.push("/");
      toast.error("Not an admin");
      return;
    }
    let imageUrl;

    console.log({ title, description, price, file, category, options });
    const product = {
      title,
      desc: description,
      price,
      catSlug: category,
      options,
      isFeatured,
    };

    try {
      if (file && file.size > 0) {
        // First, upload to Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadRes = await fetch("/api/cloudinary-upload", {
          method: "POST",
          body: uploadFormData,
        });
        if (!uploadRes.ok) {
          toast.error("Failed to upload image.");
          return;
        }
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url;
      } else {
        toast.info("No image uploaded, but product will still be added.");
        imageUrl = "";
      }

      // uploading product to the database
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, img: imageUrl }), // Send your cart to the backend
      });
      if (!res.ok) {
        toast.error("Failed to add product.");
        return;
      }
      const ress = await res.json();
      console.log(ress);
      if (res.status === 200) {
        toast.success("Product added successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }

    // Resetting the form and options
    // e.currentTarget.reset();
    // setOptions([]);
    // setOptionsDetails({ title: "", additionalPrice: 0 });
  }

  function handleOptions() {
    setOptions((prev) => [...prev, optionsDetails]);
  }

  return (
    <div className="flex justify-center w-full ">
      <form onSubmit={handleSubmit} className=" my-9 w-[80%]">
        <div className="mb-6">
          <h1 className="font-bold text-3xl text-red-600">Add a New Product</h1>
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="title">Title</label>
          <input
            required
            className="p-1 ring-1 ring-red-400 rounded-md mt-1"
            type="text"
            name="title"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="description">Description</label>
          <textarea
            required
            className="p-1 ring-1 ring-red-400 rounded-md mt-1"
            name="description"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="price">Price</label>
          <input
            required
            className="p-1 ring-1 ring-red-400 rounded-md mt-1"
            type="number"
            name="price"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="image">Image</label>
          <input
            className="p-1 ring-1 ring-red-400 rounded-md mt-1"
            type="file"
            name="image"
          />
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            className="p-1 ring-1 ring-red-400 rounded-md mt-1"
            defaultValue="pizzas"
          >
            <option value="pizzas">pizzas</option>
            <option value="pastas">pastas</option>
            <option value="burgers">burgers</option>
          </select>
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="category">Featured</label>
          <select
            name="isFeatured"
            className="p-1 ring-1 ring-red-400 rounded-md mt-1"
            defaultValue="true"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label htmlFor="options">Options</label>
          <div className="flex flex-col my-2 md:flex-row lg:flex-row xl:flex-row">
            <input
              className="p-1 ring-1 ring-red-400 rounded-md mt-1 w-40"
              type="text"
              placeholder="Title"
              value={optionsDetails.title}
              onChange={(e) =>
                setOptionsDetails((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <input
              className="p-1 ring-1 ring-red-400 rounded-md mt-1 w-40"
              type="number"
              placeholder="Additional price"
              onChange={(e) =>
                setOptionsDetails((prev) => ({
                  ...prev,
                  additionalPrice: Number(e.target.value),
                }))
              }
            />

            <button
              type="button"
              className="w-40 p-2 bg-amber-600 text-amber-50 rounded-full m-1"
              onClick={handleOptions}
            >
              Add Option
            </button>
          </div>
          <p> Added options: </p>
          {options.length > 0 ? (
            options.map((item, index) => (
              <div key={index} className="flex gap-2">
                <p>{item.title}</p>
                <p>{item.additionalPrice}</p>
              </div>
            ))
          ) : (
            <p>No Options yet</p>
          )}
        </div>
        <button
          type="submit"
          className="w-40 p-2 bg-green-600 text-amber-50 rounded-full mt-3 "
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductpage;
