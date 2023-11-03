import React from 'react';
import './Contact.css'; // Add your custom CSS file for styling

function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-box">
        <h2 className="contact-heading">About Me</h2>
        <p className="contact-text">
          Hi, I'm Davit Barseghyan, a computer science major with a data science minor. I'm set to graduate in December 2023, and my passion lies at the intersection of technology and data. My interests encompass machine learning, artificial intelligence, and full-stack development, as well as data analysis. Currently, I work as a database administrator, where I've honed my skills in managing both SQL and NoSQL databases.
        </p>
        <p className="contact-text">
          I'm proficient in several programming languages, including Python, Java, and JavaScript. I've had hands-on experience with various technologies, such as React and Node.js for full-stack development, Matplotlib and Pandas for data visualization and analysis, and scikit-learn and TensorFlow for machine learning projects. My journey in the world of technology and data has been an exciting one, and I'm always eager to learn and explore new opportunities.
        </p>
      </div>
      <div className="contact-box">
        <h2 className="contact-heading">Contact</h2>
        <p className="contact-text">Reach me by email: davitbarseg@gmail.com</p>
        <p className="contact-text">Reach me by phone: +1 (203) 434 - 9672</p>
      </div>
    </div>
  );
}

export default Contact;
