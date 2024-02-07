// FlightForm.js
import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FlightForm = ({ onForecast }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stops, setStops] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [cardImages, setCardImages] = useState([]);
  const [isFlipped, setIsFlipped] = useState(Array(6).fill(false)); // Assume 6 cards for illustration
  const inputFieldNames = ['Source', 'Destination', 'Date', 'Stops', 'Arrival Time', 'Departure Time'];

  const images = [
    'https://img.cdn-pictorem.com/uploads/acrylic/1/acr1_454308.jpg', // URL for source image
    'https://i.guim.co.uk/img/media/72f8c5895a073d7bc9f414a9a2016b9d5d589f58/0_0_3900_2340/master/3900.jpg?width=620&quality=85&auto=format&fit=max&s=ec4b4627ee804d5a49ee667519e7e050', // URL for destination image
    'https://st2.depositphotos.com/1007566/7261/v/450/depositphotos_72610397-stock-illustration-airplane-travel.jpg', // URL for date image
    'https://www.pointhacks.com.au/wp-content/uploads/2019/09/Short-haul-vs-long-haul-route-examples.gif', // URL for stops image
    'https://cdn.images.express.co.uk/img/dynamic/25/590x/cancelled-flights-frankfurt-airport-893725.jpg?r=1686998680160', // URL for arrival time image
    'https://media.gettyimages.com/id/155384959/photo/abstract-airline-schedule-and-traffic-flight-board.jpg?s=1024x1024&w=gi&k=20&c=zRcXCPfqTBwfDviOrxvumqvXxhCHqSEoK9yUQCVrhjY=', // URL for departure time image
  ];


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('https://picsum.photos/v2/list?page=1&limit=6');
        const fetchedImages = response.data.map((item) => item.download_url);
        setCardImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleCardClick = (index) => {
    if (!isFlipped[index]) {
      handleCardFlip(index);
    }
  };

  const handleCardFlip = (index) => {
    const updatedFlips = [...isFlipped];
    updatedFlips.fill(false);  // Flip all cards to their front side
    updatedFlips[index] = true;  // Flip the clicked card
    setIsFlipped(updatedFlips);
  };
  

  const handleForecast = async () => {
    try {
      setError(null);
      setLoading(true);

      // Validate form fields
      if (!source || !destination || !stops || !arrivalTime || !departureTime) {
        throw new Error('Please fill in all fields.');
      }

      // Call your ML model API with source, destination, and date
      const response = await axios.post('YOUR_ML_API_ENDPOINT', {
        source,
        destination,
        date,
        stops,
        arrivalTime,
        departureTime,
      });

      // Update the forecast result using onForecast callback
      onForecast({
        predictedFare: response.data.predictedFare,
        stops,
        arrivalTime,
        departureTime,
      });
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };



return (
<div className="flight-form-container">
  <div className="text-center">
    
    <div className="text-center">
      <h2 className="forecast-title">Flight Fare Forecast</h2>
    </div>
    <div className="card-container">
      {cardImages.map((image, index) => (
        <div key={index} className="custom-card" onClick={() => handleCardClick(index)}>
          {/* Front side of the card */}
          <Card className="custom-card-inner" onClick={() => handleCardClick(index)}>
            {/* <Card.Img variant="top" src={image} alt={`Card ${index}`} className="card-image" /> */}
            <Card.Img variant="top" src={images[index]} alt={`Card ${index}`} className="card-image" />
            <Card.Body>
              <Card.Text className="card-heading">{inputFieldNames[index]}</Card.Text>
            </Card.Body>
          </Card>

          {/* Back side of the card */}

          {isFlipped[index] && (
          
            <Card className="custom-card-inner" style={{ padding: '70px', width: '140px', height: '230px' }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {/* <Form.Group controlId={`inputField${index}`}> */}
                <Form.Group controlId={`inputField${index}`} style={{ width: '150%', position: 'relative', top: '20%' }}>
                <Form.Label
                  style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  marginBottom: '10px'
                }}
                >
                {inputFieldNames[index]}
                </Form.Label>


                  {inputFieldNames[index] === 'Date' ? (
                    <DatePicker selected={date} onChange={(newDate) => setDate(newDate)} dateFormat="MM/dd/yyyy" />
                  ) : (

                    <Form.Control
                      type="text"
                      // style={{ width: '100%', padding: '8px', borderRadius: '4px', textAlign: 'center' }}
                      style={{ width: '80%', padding: '8px', borderRadius: '4px', textAlign: 'center' }} // Adjust styles here
                      placeholder={
                        inputFieldNames[index] === 'Source'
                          ? 'Enter source'
                          : inputFieldNames[index] === 'Destination'
                          ? 'Enter destination'
                          : inputFieldNames[index] === 'Stops'
                          ? 'Enter stops'
                          : inputFieldNames[index] === 'Arrival Time'
                          ? 'Enter Arrival hr:min'
                          : 'Enter departure hr:min'
                      }
                      value={
                        inputFieldNames[index] === 'Source'
                          ? source
                          : inputFieldNames[index] === 'Destination'
                          ? destination
                          : inputFieldNames[index] === 'Stops'
                          ? stops
                          : inputFieldNames[index] === 'Arrival Time'
                          ? arrivalTime
                          : departureTime
                      }
                       
                      onChange={(e) => {
                        if (inputFieldNames[index] === 'Source') setSource(e.target.value);
                        else if (inputFieldNames[index] === 'Destination') setDestination(e.target.value);
                        else if (inputFieldNames[index] === 'Stops') setStops(e.target.value);
                        else if (inputFieldNames[index] === 'Arrival Time') setArrivalTime(e.target.value);
                        else setDepartureTime(e.target.value);
                      }}
                    />
                  )}
                </Form.Group>
              </Card.Body>
            </Card>
          )
          } 
          {/* flipped end */}
        </div>
      ))}
    </div>
    {error && <Alert variant="danger">{error}</Alert>}
 
      <div className="text-center mt-5">
  <div className="row justify-content-center">
    <div className="col-md-6">
      <Button
        variant="primary"
        onClick={handleForecast}
        disabled={loading}
        className="custom-button"
      >
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            Loading...
          </>
        ) : (
          'Get Forecast'
        )}
      </Button>
    </div>
  </div>
</div>

      

  </div>
  </div>
);
};

export default FlightForm;