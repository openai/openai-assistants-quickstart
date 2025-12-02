"use client";

import React, { useEffect, useState } from "react";
import Chat from "../components/chat";
import { handleBriostackCall } from "../utils/briostack";
import { proxyOptimization } from "@/app/utils/optimization-client";
import styles from "./page.module.css";

const PestLanding = () => {
  const [city, setCity] = useState("Your Area");
  const [region, setRegion] = useState("Florida");
  const [image, setImage] = useState("/images/default.png");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const newCity = data.city || "Your Area";
        const newRegion = data.region || "Florida";
        setCity(newCity);
        setRegion(newRegion);
        const imgName = newCity.toLowerCase().replace(/ /g, "-");
        setImage(`/images/${imgName}.jpg`);
      } catch {
        // ignore errors and use defaults
      }
    };
    fetchLocation();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const functionCallHandler = async (call) => {
    try {
      if (call?.function?.name === "call_briostack") {
        const args = JSON.parse(call.function.arguments);
        const result = await handleBriostackCall(args);
        return JSON.stringify(result);
      }
      if (call?.function?.name === "optimize_routes") {
        const args = JSON.parse(call.function.arguments);
        const provider =
          args.provider === "samsara" ? "samsara" : "nextbillion";
        const result = await proxyOptimization(args.payload, provider);
        return JSON.stringify(result);
      }
    } catch (err) {
      console.error(err);
      return JSON.stringify({ error: "Failed to handle function call" });
    }
  };

  return (
    <>
      <header>
        <h1>{city} Pest Control & Lawn Services</h1>
        <p>Serving the Greater {city} Area</p>
        <button className={styles.cta} onClick={scrollToContact}>
          Get Free Quote
        </button>
      </header>

      <nav>
        <a href="#services">Services</a>
        <a href="#industries">Industries</a>
        <a href="#dynamic-location">Your Location</a>
        <a href="#pest-library">Pest Library</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className={styles.container}>
        <section id="services">
          <h2>Our Services</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Ant Control</h3>
              <p>Effective ant identification, baiting, and barrier protection.</p>
            </div>
            <div className={styles.card}>
              <h3>Roach Control</h3>
              <p>Interior and exterior roach treatments and prevention.</p>
            </div>
            <div className={styles.card}>
              <h3>Insect &amp; Repellent Services</h3>
              <p>Full-spectrum indoor and outdoor insect protection.</p>
            </div>
            <div className={styles.card}>
              <h3>Mosquito Control</h3>
              <p>Targeted mosquito fogging and larval site reduction.</p>
            </div>
            <div className={styles.card}>
              <h3>Flea &amp; Tick Treatment</h3>
              <p>Pet-safe treatments for yards and home interiors.</p>
            </div>
            <div className={styles.card}>
              <h3>Rodent Services</h3>
              <p>Mice and rat exclusion, trapping, and future-proofing.</p>
            </div>
            <div className={styles.card}>
              <h3>Bed Bug Services</h3>
              <p>Comprehensive treatment and post-treatment monitoring.</p>
            </div>
            <div className={styles.card}>
              <h3>Fly Control</h3>
              <p>Fly prevention, sanitation audits, and trapping systems.</p>
            </div>
            <div className={styles.card}>
              <h3>Lawn Spray &amp; Fertilization</h3>
              <p>Pesticide applications, fungus control, whitefly and chinch bug solutions.</p>
            </div>
          </div>
        </section>

        <section id="industries">
          <h2>Industries We Serve</h2>
          <ul>
            <li>Residential Homes &amp; Apartments</li>
            <li>Commercial Buildings &amp; Offices</li>
            <li>HOAs, Property Managers, Condos</li>
            <li>Warehouses &amp; Cleaning Companies</li>
            <li>Schools, Churches &amp; Synagogues</li>
            <li>Hotels, Airbnb, Short-term Rentals</li>
            <li>Golf Courses, Stadiums &amp; Green Spaces</li>
          </ul>
          <p>Custom service plans available for high-traffic and sensitive locations.</p>
        </section>

        <section id="dynamic-location">
          <h2>{city}, {region}</h2>
          <img className={styles.responsive} src={image} alt="City view" />
          <iframe
            className={styles.map}
            loading="lazy"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${city}, ${region}`)}&output=embed`}
          ></iframe>
        </section>

        <section id="pest-library">
          <h2>Pest Library</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Ants</h3>
              <p>Includes fire ants, ghost ants, and carpenter ants. Highly invasive and colony-driven.</p>
            </div>
            <div className={styles.card}>
              <h3>Roaches</h3>
              <p>German and American varieties thrive in warm, moist environments.</p>
            </div>
            <div className={styles.card}>
              <h3>Mosquitoes</h3>
              <p>Transmit diseases and breed in stagnant water. Targeted treatments available.</p>
            </div>
            <div className={styles.card}>
              <h3>Fleas &amp; Ticks</h3>
              <p>Infest pets and outdoor areas. Known vectors for illness.</p>
            </div>
            <div className={styles.card}>
              <h3>Rats &amp; Mice</h3>
              <p>Rodent control and exclusion strategies available.</p>
            </div>
            <div className={styles.card}>
              <h3>Bed Bugs</h3>
              <p>Hide in furniture, travel with luggage, and cause itchy bites.</p>
            </div>
            <div className={styles.card}>
              <h3>Flies</h3>
              <p>Fast breeders, often linked to sanitation. Controlled via integrated approaches.</p>
            </div>
            <div className={styles.card}>
              <h3>Whiteflies &amp; Chinch Bugs</h3>
              <p>Common lawn pests in Florida, especially in high humidity.</p>
            </div>
          </div>
        </section>

        <section id="contact">
          <h2>Contact Us</h2>
          <p>Ready to schedule service or need a quote?</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <p>
              <label>
                Name<br />
                <input type="text" required />
              </label>
            </p>
            <p>
              <label>
                Email<br />
                <input type="email" required />
              </label>
            </p>
            <p>
              <label>
                Phone<br />
                <input type="tel" required />
              </label>
            </p>
            <button type="submit" className={styles.cta}>Submit</button>
          </form>
          <p><strong>Email:</strong> info@pestridall.com</p>
          <p><strong>Phone:</strong> (Your Phone Number)</p>
          <p><strong>Service Hours:</strong> Mon–Sat: 8am–6pm</p>
        </section>

        <section id="chat">
          <h2>Chat with Our Assistant</h2>
          <p>Ask us anything about your account or services.</p>
          <Chat functionCallHandler={functionCallHandler} />
        </section>
      </div>

      <footer>
        <p>&copy; 2025 Pest Protection Rid All, LLC. All rights reserved.</p>
      </footer>
    </>
  );
};

export default PestLanding;
