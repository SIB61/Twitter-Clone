import styles from "./EditProfile.module.css";
import tweeterLogo from "../../../../../public/images/Twitter-logo.png";
import Image from "next/image";
import { Input } from "@/shared/components/input/Input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import { FileInput } from "@/shared/components/file-reader/FileReader";
import { Avator } from "../avatar/Avatar";
import { useState } from "react";
import user from "@/pages/api/user";
import { useSession } from "next-auth/react";
import { useLoading } from "@/shared/hooks/useLoading";
import { LoadingBar } from "@/shared/components/loading-bar/LoadingBar";
export function EditProfile({ user,onComplete }) {

  const {
    register,
    handleSubmit,
    formState: { isValid ,errors},
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      dateOfBirth: new Date(user?.dateOfBirth),
    },
  });

  const router = useRouter();
  const loading = useLoading()
  const [profile, setProfile] = useState(user?.image);
  const [cover, setCover] = useState(user?.cover);
  const onSubmit = async (data) => {
    try {
      loading.start()
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("email", data.email);
      if (profile){
        formData.append("image", profile.file);
      } 
      if (cover) formData.append("cover", cover.file);
      const newUserRes = await fetch("/api/user/"+user?.id+"/update", {method:'PATCH',body:formData});
      const newUser = await newUserRes.json()
      loading.complete()
      console.log(newUser)
      onComplete(newUser)
    } catch (err) {
      loading.complete()
      onComplete(user)
      console.log(err);
    }
  };

  return (
    <div className={styles.editCard}>
      <LoadingBar loading={loading.loading}/>
      <Image src={tweeterLogo} alt="tweeter" className={styles.tweeterLogo} />
      <h4>Edit Your Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FileInput
          id="cover"
          className={styles.cover}
          onSelect={(e) => {
            setCover(e);
          }}
        >
          <img src={cover?.src? cover.src : cover} alt="cover" />
        </FileInput>

        <FileInput
          id="profile"
          className={styles.profile}
          onSelect={(e) => {
            setProfile(e);
          }}
        >
          <div>
            <Avator src={profile?.src? profile.src : profile} size={70} />
          </div>
        </FileInput>

        <Input
          register={register("name", {
            minLength: 3,
            required: "name is required",
          })}
          placeHolder="name"
        />

        <Input
          register={register("email", { required: "email is required" })}
          placeHolder="email"
        />

        <Input
          register={register("dateOfBirth", {
            required: "date of birth is required",
          })}
          placeHolder="date of birth"
          type="date"
        />

        <button
          disabled={!isValid}
          className={`btn  ${isValid ? "btn-primary" : "btn-disabled"}`}
          type="submit"
        >
          save
        </button>
      </form>
    </div>
  );
}