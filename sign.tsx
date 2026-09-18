import { SignIn } from '@clerk/react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-6">
      <SignIn
        appearance={{
          variables: {
  colorPrimary: '#E8674A',
  colorForeground: '#1C1917',
  colorBackground: '#FFFFFF',
  colorInput: '#FDFAF7',
  colorInputForeground: '#1C1917',
  borderRadius: '16px',
},
        }}
      />
    </div>
  )
}