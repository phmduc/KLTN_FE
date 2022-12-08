import { Link } from 'react-router-dom';
import './ThanksPage.scss';

function ThanksPage() {
  return (
    <div className='thanks-page'>
      <div className='container'>
        <h1>Thank you.</h1>
        <p>Your order was completed successfully.</p>
        <div className='mail'>
          <img
            src='https://cdn-icons-png.flaticon.com/512/91/91848.png'
            alt='mail'
          />
          <p className='mail-desc'>
            An email receipt including the details bout your order has been sent
            to the mail address provided. Please keep it for your records.
          </p>
        </div>
        <p className='description'>
          You can visit the My Account page at any time to check the status of
          your order.
        </p>
        <Link to='/'>
          <button type='button' class='btn btn-dark'>
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ThanksPage;
