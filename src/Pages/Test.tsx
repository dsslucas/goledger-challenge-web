import React from 'react';
import { randomImage } from '../common/randomImage';


// const images = randomImage<HTMLImageElement>(
//   require.context('../assets/img', false, /\.(png|jpg|jpe?g|svg)$/)
// )

const images = require.context('../assets/img', true);
const imageList = images.keys().map(image => images(image));

const Test: React.FC = () => {

  return (
    <div className='flex justify-center items-center w-full h-full gap-x-2'>
      <img src={randomImage()} alt={`image-`} className='w-36 h-36'/>
    </div>
  );
};

export default Test;