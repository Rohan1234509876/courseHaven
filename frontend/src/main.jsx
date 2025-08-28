import {BrowserRouter} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import './index.css'
import App from './App.jsx'
const stripePromise = loadStripe("pk_test_51S0cVV7I8VocB713gZ8OhU7JZfix55DcXUXtUtpQSLaC4wGLFYb07k5rFhi3bYS0WJjJYmupDk9ukkfsKlB1ctQ500k6gNNXUg");


createRoot(document.getElementById('root')).render(
    <Elements stripe={stripePromise}>
        <BrowserRouter>
    <App />
    </BrowserRouter>
    </Elements>
    
    
  
)
