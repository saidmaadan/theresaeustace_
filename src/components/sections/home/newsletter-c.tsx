'use client'

import React, { useState } from 'react';
import Image from 'next/image';

const NewsletterForm = () => {
  const [formData, setFormData] = useState({
    FNAME: '',
    EMAIL: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // The form will submit to Mailchimp's URL
    const form = e.target;
    form.submit();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 bg-black bg-[url('/svg/lines3.svg')] bg-no-repeat bg-cover">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="max-w-lg">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Get the free book
              </span>
              <h3 className="font-bold mt-6 mb-4 text-white text-3xl">
                FREE Enemies to Lovers Romance
              </h3>
              <p className="text-white mb-4">
                I agreed to be her fake fiancé to erase her past… NOT to fall in love.
              </p>
              <p className="text-gray-300">
                When we first met in my clinic she acted like she hated me. That didn't stop me from hiring her though. I knew that tension between us was something… more. 
                This undeniable chemistry between us was off the charts. As an employee, she's off limits and I need to keep this professional… right? This small town is already exploding with rumors about us. Last thing I need is to fuel that fire. But I'm hypnotized by her glances, her curves, her scent. Now dark secrets from her past are intersecting with even darker family secrets of my own. She desperately needs my help and there is only one solution for us...
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-12 text-center rounded-lg shadow-lg">
              <div className="mb-8">
                <div className="mb-6">
                  <Image
                    src="https://sophiabent.s3.us-west-2.amazonaws.com/media/sb/sb-cover.png"
                    alt="Book Cover"
                    width={300}
                    height={400}
                    style={{ maxWidth: '100%', objectFit: 'cover' }}
                    className="mx-auto max-w-full h-auto"
                  />
                </div>
                <h4 className="font-bold text-2xl mb-4">Let&apos;s stay in touch!</h4>
                <p className="text-gray-600 mb-6">
                  Enter your email address to join my newsletter. You&#39;ll receive exclusive deals and special offers, and be the first to know about new releases. You will also receive a copy of Dr. Fake as a welcome gift! You can unsubscribe at any time.
                </p>
              </div>

              <form
                action="https://sophiabent.us20.list-manage.com/subscribe/post?u=928b3250e9faf5ff353ac1b0e&amp;id=7c08d10bf2"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                // target="_blank"
                onSubmit={handleSubmit}
              >
                <div id="mc_embed_signup_scroll">
                  <input
                    className="w-full px-4 py-3 mb-4 border  bg-pink-100 border-gray-300 rounded focus:outline-none focus:border-pink-400"
                    type="text"
                    value={formData.FNAME}
                    onChange={handleChange}
                    name="FNAME"
                    id="mce-FNAME"
                    placeholder="Your name"
                  />
                  <input
                    className="w-full px-4 py-3 mb-4 bg-pink-100 border border-pink-200 rounded focus:outline-none focus:border-pink-400"
                    type="email"
                    value={formData.EMAIL}
                    onChange={handleChange}
                    name="EMAIL"
                    id="mce-EMAIL"
                    placeholder="E-mail address"
                    required
                  />
                  <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input
                      type="text"
                      name="b_928b3250e9faf5ff353ac1b0e_7c08d10bf2"
                      tabIndex="-1"
                      value=""
                      readOnly
                    />
                  </div>
                  <button
                    className="w-full px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-pink-300 transition-colors"
                    type="submit"
                    name="subscribe"
                    id="mc-embedded-subscribe"
                  >
                    GET MY FREE BOOK
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterForm;