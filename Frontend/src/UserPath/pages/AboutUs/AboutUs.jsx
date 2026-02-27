import React from 'react'
import './AboutUs.css'

function AboutUs() {
  return (
    <section className="aboutus-container">
      <h1>About Our Sports Academy</h1>
      <p>
        Welcome to our Sports Academy, a premier institution dedicated to nurturing talent and fostering a love for sports in athletes of all ages and skill levels.
      </p>

      <ul className="features-list">
        <li><strong>Expert Coaching:</strong> Professional trainers with years of experience across multiple sports disciplines.</li>
        <li><strong>State-of-the-Art Facilities:</strong> Modern infrastructure including courts, fields, and gyms equipped with the latest technology.</li>
        <li><strong>Holistic Development:</strong> Focus on physical fitness, mental strength, and sportsmanship.</li>
        <li><strong>Wide Range of Sports:</strong> Cricket, Football, Tennis, Badminton, Swimming, and more.</li>
        <li><strong>Community & Events:</strong> Regular tournaments, workshops, and team-building activities.</li>
        <li><strong>Personalized Training:</strong> Tailored programs to suit individual skill levels and goals.</li>
      </ul>

      <p className="closing">
        Join us and be part of a passionate community where every athlete’s potential is nurtured with dedication and care.
      </p>
    </section>
  )
}

export default AboutUs