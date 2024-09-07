import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../utils/firebase'
import Container from '../../components/container'

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <div className='h-screen grid place-items-center'>
        <form
          onSubmit={handleSubmit}
          className='space-y-4 mx-auto w-[320px] max-w-full'
        >
          <div>
            <h1 className='text-gray-600 text-sm text-center'>Login</h1>
            <h2 className='text-orange-600 text-xl text-center mt-1.5 flex items-center justify-center gap-1.5'>
              Food Journal{' '}
              <span className='text-xs px-1.5 py-0.5 rounded-full bg-gray-800 font-medium w-8 text-white'>
                V1
              </span>
            </h2>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='text'
              name='email'
              value={form.e}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-2.5 py-1.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            />
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='text'
              name='password'
              value={form.password}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-2.5 py-1.5 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            />
          </div>
          <button
            type='submit'
            className='bg-orange-600 rounded-lg border-b-2 border-orange-700 px-4 text-white py-1.5 w-full'
          >
            Login
          </button>
          <p>
            create new account{' '}
            <Link to='/register' className='text-orange-600'>
              Here
            </Link>
          </p>
        </form>
      </div>
    </Container>
  )
}
