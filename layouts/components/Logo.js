import config from "@config/config.json";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ src }) => {
  // destructuring items from config object
  const { base_url, logo, logo_width, logo_height, logo_text, title } =
    config.site;

  return (
    <Link
      href={base_url}
      className="navbar-brand flex items-center gap-2 py-1"
    >
      {src || logo ? (
        <>
          <Image
            width={logo_width.replace("px", "") * 2}
            height={logo_height.replace("px", "") * 2}
            src={src ? src : logo}
            alt={title}
            priority
            className="h-auto"
            style={{
              width: logo_width.replace("px", "") + "px",
              height: logo_height.replace("px", "") + "px",
            }}
          />
          {(logo_text || title) && (
            <span className="font-primary font-bold text-xl text-dark">
              {logo_text || title}
            </span>
          )}
        </>
      ) : logo_text ? (
        logo_text
      ) : (
        title
      )}
    </Link>
  );
};

export default Logo;
