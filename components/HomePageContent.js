// components/HomepageContent.js
import React from 'react';
import styles from '../styles/Home.module.css';

const HomePageContent = () => {
  return (
    <div className={styles.contentContainer}>
      <h1>Welcome to the EEE Scheduler!</h1>
      <p>This platform helps teams organize and manage their events efficiently.</p>
      <section className={styles.features}>
        <div>
          <h3>Key Features</h3>
          <ul>
            <li>Create and manage events, exercises, and experiments</li>
            <li>View events in a clear, concise table format</li>
            <li>Plan effectively using the calendar view</li>
            <li>Collaborate seamlessly with your team</li>
          </ul>
        </div>
        <div>
          <h3>About Us</h3>
          <p>
            Team Event Manager was created by Dodge Kudrna to solve the challenges of coordinating Exercises/Events/Experiments (EEE).
            We are dedicated to providing a simple, intuitive, and powerful solution for all your EEE scheduling needs.
          </p>
        </div>
      </section>
      <footer className={styles.footer}>
        <p>
          For support and inquiries, contact us at: <a href="mailto:support@example.com">support@example.com</a>
        </p>
      </footer>
    </div>
  );
};

export default HomePageContent;