import React, { useRef } from 'react';
import { connect } from 'redux-bundler-react';
import Navbar from '../../app-components/navbar';
import ProfileForm from '../../app-components/profile-form';

export default connect(
  'doProfileSave',
  'doUpdateUrlWithHomepage',
  'selectAuthIsLoggedIn',
  'selectProfileActive',
  ({
    doProfileSave,
    doUpdateUrlWithHomepage,
    authIsLoggedIn: isLoggedIn,
    profileActive: profile,
  }) => {
    // If user already has a profile or is not logged in,
    // i.e. navigated directly to "/signup", redirect them back to home.
    if (profile || !isLoggedIn) {
      doUpdateUrlWithHomepage(['/']);
    }

    const form = useRef();
    const handleSave = () => {
      if (form.current) {
        form.current.save();
        doUpdateUrlWithHomepage(['/']);
      }
    };
    return (
      <div>
        <Navbar theme='primary' brand='Home' />
        <section
          className='container'
          style={{
            position: 'absolute',
            top: '6em',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div
            style={{ display: 'grid', placeItems: 'center', height: '100%' }}
          >
            <div className='card' style={{ maxWidth: '32em' }}>
              <div className='card-body'>
                <h5>Create your profile to continue</h5>
                <p>
                  <small>
                    This information will be used to display your identity
                    associated with changes you make within this system and to
                    facilitate sending notifications. We wont send you any
                    notifications unless you or an admin subscribe to alerts.
                  </small>
                </p>
                <ProfileForm ref={form} onSave={doProfileSave} />
                <div className='clearfix'>
                  <div className='float-right'>
                    <a href='/logout'>
                      <button className='btn btn-sm btn-secondary mr-2'>
                        Logout
                      </button>
                    </a>
                    <button
                      onClick={handleSave}
                      className='btn btn-sm btn-success'
                    >
                      Save and Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
);
