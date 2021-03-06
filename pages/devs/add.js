import { Layout } from '@/components/layout'
import { API_URL } from '@/config/index'
import { parseCookies } from '@/helpers/index'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AddDevPage({ token }) {
  const [values, setValues] = useState({
    name: '',
    about: '',
    website: '',
  })

  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values).some(
      element => element === ''
    )

    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
    }

    const res = await fetch(`${API_URL}/devs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('No token included')
        return
      }
      toast.error('Something Went Wrong')
    } else {
      const dev = await res.json()
      router.push(`/devs/${dev.slug}`)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  return (
    <Layout title="Add New Dope Dev">
      <Link href="/devs">Go Back</Link>
      <h1>Add Dope Dev</h1>

      <ToastContainer />

      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="name">Dev Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="website">Website</label>
            <input
              type="text"
              name="website"
              id="website"
              value={values.website}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <div>
            <label htmlFor="about">About</label>
            <textarea
              type="text"
              name="about"
              id="about"
              value={values.about}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>

        <input type="submit" value="Add Dope Dev" />
      </form>
    </Layout>
  )
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req)

  return {
    props: {
      token,
    },
  }
}
