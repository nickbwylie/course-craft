import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Turn YouTube Videos into Courses</h1>
          <p>
            Create your own learning journey by transforming YouTube videos into
            structured courses.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Easy Course Creation</h3>
            <p>
              Simply paste YouTube links and organize them into courses
              effortlessly.
            </p>
          </div>
          <div className="feature-item">
            <h3>Progress Tracking</h3>
            <p>Track your learning progress and mark lessons as completed.</p>
          </div>
          <div className="feature-item">
            <h3>Customizable Lessons</h3>
            <p>Add notes, descriptions, and quizzes to enhance learning.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>Step 1</h3>
            <p>Paste a YouTube video link.</p>
          </div>
          <div className="step">
            <h3>Step 2</h3>
            <p>Organize the video into a course with notes and quizzes.</p>
          </div>
          <div className="step">
            <h3>Step 3</h3>
            <p>Start learning and track your progress.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Video to Course Converter. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
