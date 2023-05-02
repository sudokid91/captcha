import Image from 'next/image'
import { Inter } from 'next/font/google'
import Captcha from '../components/Captcha';
import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import {newCaptchaImage} from "./api/captcha-image";

const inter = Inter({ subsets: ['latin'] })

interface IProps{
  defaultCaptchaKey: any;
}

export default function Home(props: IProps) {
  const {defaultCaptchaKey} = props;
  const [message, setMessage] = useState('');
  const [selectedIndexes, setSelectedIndexes] = useState(Array<number>);
  const [captchaKey, setCaptchaKey] = useState(defaultCaptchaKey);

  useEffect(() => {
    setSelectedIndexes([]);
  }, [captchaKey])

  const toggleSelected = (index: number) => {
		setSelectedIndexes(prev => {
			if (prev.includes(index)) {
				return prev.filter(v => v !== index);
			} else {
				return [...prev, index];
			}
		})
	} 

  const handleSendMessage = () => {
    if (!message) {
      alert(`Message sent is empty!`);
      return;
    }
    fetch(`/api/send`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        selectedIndexes,
      }),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      response.json().then(json => {
        const {captchaIsValid} = json;
        if (!captchaIsValid) {
          alert (`wrong captcha. try again`);
          setCaptchaKey(new Date().getTime());
          setMessage('');
        } else {
          alert(`message sent`);
          setCaptchaKey(new Date().getTime());
        }
      })
    }).catch(err => console.log(`error`))
  }

  return (
    <main>
      <input onChange={e => setMessage(e.target.value)} type='text' placeholder='Message' value={message}/>
      <div>
        <Captcha captchaKey={captchaKey} toggleSelected={toggleSelected} selectedIndexes={selectedIndexes}/>
      </div>
      <button onClick={handleSendMessage}>Send</button>
    </main>
  )
}

export const getServerSideProps = withIronSessionSsr(async ({req} : {req: any}) => {
  {
    if (!req.session.captchaImages) {
      req.session.captchaImages = newCaptchaImage();
      await req.session.save();
    }
    return {
      props:{
        defaultCaptchaKey: (new Date).getTime(),
      }
    };
  }
}, {
  cookieName: 'session',
  password: process.env.SESSION_SECRET_KEY || 'hoangnn',
});
