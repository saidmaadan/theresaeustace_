import React from 'react';
import Image from 'next/image';

const NewsletterForm = () => {
  return (
    <section className="py-20 bg-primary" style={{ backgroundImage: "url(/svg/lines3.svg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-lg-6 mb-4 mb-lg-0">
            <div className="mw-lg-md">
              <span className="badge bg-secondary-light">Get the free book</span>
              <h3 className="fw-bold mt-6 mb-4 text-white">FREE Enemies to Lovers Romance</h3>
              <p className="text-white">I agreed to be her fake fiancé to erase her past… NOT to fall in love.</p>
              <p className="text-muted mb-3">
                When we first met in my clinic she acted like she hated me. That didn’t stop me from hiring her though. I knew that tension between us was something… more.
                This undeniable chemistry between us was off the charts. As an employee, she’s off limits and I need to keep this professional… right? This small town is already exploding with rumors about us. Last thing I need is to fuel that fire. But I’m hypnotized by her glances, her curves, her scent. Now dark secrets from her past are intersecting with even darker family secrets of my own. She desperately needs my help and there is only one solution for us...
                {/* We need to get fake engaged and convince the town we’re blissfully in love. There’s just one rule - we can’t catch feelings. That part might be easier said than done… */}
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="p-12 text-center bg-white">
              <section className="feature">
                <div className="feature__icon">
                  <Image
                    src="https://sophiabent.s3.us-west-2.amazonaws.com/media/sb/sb-cover.png"
                    alt="Book Cover"
                    width={300}
                    height={400}
                    style={{ maxWidth: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h4 className="feature__text fw-bold">Let’s stay in touch!</h4>
                <p className="feature__text2 mb-6">
                  Enter your email address to join my newsletter. You'll receive exclusive deals and special offers, and be the first to know about new releases. You will also receive a copy of Dr. Fake as a welcome gift! You can unsubscribe at any time.
                </p>
              </section>

              <form
                action="https://sophiabent.us20.list-manage.com/subscribe/post?u=928b3250e9faf5ff353ac1b0e&amp;id=7c08d10bf2"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
                noValidate
              >
                <div id="mc_embed_signup_scroll">
                  <input className="form-control mb-4" type="text" name="FNAME" id="mce-FNAME" placeholder="Your name" />
                  <input className="form-control mb-4" type="email" name="EMAIL" id="mce-EMAIL" placeholder="E-mail address" required />
                  <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
                    <input type="text" name="b_928b3250e9faf5ff353ac1b0e_7c08d10bf2" tabIndex="-1" value="" />
                  </div>
                  <button className="btn btn-secondary w-100" type="submit" name="subscribe" id="mc-embedded-subscribe">
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