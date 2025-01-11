'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    form.submit();
  };

  return (
    <div className="w-full lg:w-auto md:w-1/2 sm:w-1/2 pb-10">
      {/* <h6 className="text-2xl font-bold mb-6 pt-10">Weekly Newsletter</h6> */}
      <p className="text-g mb-4">Sign up to get my free weekly newsletter.</p>
      
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
          <div className="flex">
            <input
              className="flex-1 bg-pink-100 text-pink-300 px-4 py-3 rounded-l focus:outline-none placeholder-white/60"
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="hidden" aria-hidden="true">
              <input 
                type="text"
                name="b_928b3250e9faf5ff353ac1b0e_7c08d10bf2"
                tabIndex="-1"
                value=""
                readOnly
              />
            </div>
            <button
              className="bg-primary text-white px-4 rounded-r hover:bg-pink-200 transition-colors"
              type="submit"
              name="subscribe"
              id="mc-embedded-subscribe"
              aria-label="Subscribe"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewsletterSignup;