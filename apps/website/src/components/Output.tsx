const INSTANCE_URI = "http://localhost:6000";

export default function Output() {
  return (
    <div className="h-1/3 bg-background">
      <iframe width={"100%"} height={"100%"} src={`${INSTANCE_URI}`} />
    </div>
  )
}

