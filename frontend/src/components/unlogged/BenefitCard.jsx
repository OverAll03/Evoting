/**
 * This code was generated by Builder.io.
 */
import React from "react";

function BenefitCard({ image, title, description, action }) {
  return (
    <div className="flex overflow-hidden flex-col flex-1 shrink basis-0 min-w-[240px]">
      <img
        loading="lazy"
        src={image}
        alt={title}
        className="object-contain w-full aspect-[1.69]"
      />
      <div className="flex flex-col mt-8 w-full">
        <div className="flex flex-col items-start w-full text-center text-black">
          <h3 className="text-2xl font-bold leading-9">{title}</h3>
          <p className="mt-4 text-base leading-6">{description}</p>
        </div>
        <div className="flex flex-col items-center pt-2 mt-6 w-full text-base text-black">
          <a href="#" className="flex gap-2 justify-center items-center">
            <span className="self-stretch my-auto">{action}</span>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2185b5c4a8eac181476ec0843b4c69172556dd7401b6d4cd1833280bfc96f532?placeholderIfAbsent=true&apiKey=549c322b647e496e99a9065b5f46d9e4"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default BenefitCard;
