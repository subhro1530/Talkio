// components/GettingStarted.js
import React from "react";
import styles from "../styles/GettingStarted.module.css";
import Link from "next/link";

const GettingStarted = () => {
  return (
    <section className={styles.gettingStarted}>
      <div className={styles.content}>
        <h2 className="heading">Welcome to TalkIO!</h2>
        <p className="paragraph">
          Talk.io is your go-to platform for experiencing seamless video calling
          like never before. We provide a reliable and intuitive video
          communication solution that connects you with friends, family,
          colleagues, or clients effortlessly. With our user-friendly interface
          and advanced technology, you can enjoy crystal-clear video and audio
          quality, real-time screen sharing, and instant messaging—all in one
          place. Whether it's staying connected with loved ones or conducting
          important business meetings, Talk.io ensures that your video calls are
          hassle-free and enjoyable. Join us today and discover the future of
          effortless video communication.
        </p>
        <Link href="/start" className={styles.getStartedBtn}>
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default GettingStarted;
