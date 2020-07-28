import React, { useState } from 'react';
import { useCssHandles } from 'vtex.css-handles';
import { TimeSplit } from './typings/global';
import { tick } from './utils/time';
import { useQuery } from 'react-apollo';
import useProduct from 'vtex.product-context/useProduct';
import productReleaseDate from './graphql/productReleaseDate.graphql';

interface CountdownProps { 
  targetDate: string;
}

const DEFAULT_TARGET_DATE = (new Date('2021-06-25')).toISOString();
const CSS_HANDLES = ["countdown"];

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ 
}) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00', 
    minutes: '00', 
    seconds: '00'
  })

  const handles = useCssHandles(CSS_HANDLES)
  const { product: { linkText } } = useProduct()
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  });

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    )
  }

  console.log(data);

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime);

  return (
    <div className={`${handles.countdown} db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {

  }
}

export default Countdown
