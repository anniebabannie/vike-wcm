const Wrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="max-w-4xl container mx-auto py-12">
      {children}
    </div>
  )
}

export default Wrapper;