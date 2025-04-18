import notFoundImage from "@/assets/notfound.gif";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <section className="page_404 py-10 bg-white font-serif">
      <div className="container mx-auto">
        <div className="row flex justify-center">
          <div className="col-sm-12 text-center">
            <div
              className="four_zero_four_bg bg-cover bg-center h-96"
              style={{
                backgroundImage: `url(${notFoundImage})`,
              }}
            >
              <h1 className="text-center text-8xl">404</h1>
            </div>
            <div className="contant_box_404 mt-[-50px]">
              <h3 className="text-4xl">{`Look like you're lost`}</h3>
              <p className="text-xl">
                The page you are looking for not available!
              </p>
              <Link to="/">
                <Button variant={"destructive"}>Go to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
