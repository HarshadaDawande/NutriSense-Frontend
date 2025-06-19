import imgImage1 from "figma:asset/0ea993ea334549e4687cdf9d4e8c4fcf7e49e858.png";

function Register() {
  return (
    <div
      className="absolute h-10 left-[81px] top-[152px] w-[148px]"
      data-name="Register"
    >
      <div className="absolute bottom-[-100%] flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal justify-center leading-[normal] left-[-2.703%] right-[-2.703%] text-[#000000] text-[36px] text-center text-nowrap top-[-100%] tracking-[-0.54px] whitespace-pre">
        <p className="adjustLetterSpacing block mb-0">Food</p>
        <p className="adjustLetterSpacing block mb-0">Tracking</p>
        <p className="adjustLetterSpacing block">App</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="absolute h-[41px] top-[324px] translate-x-[-50%] w-[185px]"
      data-name="Button"
      style={{ left: "calc(50% + 0.5px)" }}
    >
      <div className="absolute bg-[#008080] inset-0 rounded-md">
        <div className="absolute border-2 border-[#000000] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <div
        className="absolute bottom-[31.754%] flex flex-col font-['Roboto:Black',_sans-serif] font-black justify-center leading-[0] left-[38.689%] right-[39.689%] text-[#ffffff] text-[13px] text-center text-nowrap top-[31.66%] tracking-[0.52px] uppercase"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          LOGIN
        </p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="absolute h-[41px] top-[386px] translate-x-[-50%] w-[185px]"
      data-name="Button"
      style={{ left: "calc(50% + 0.5px)" }}
    >
      <div className="absolute bg-[#008080] inset-0 rounded-md">
        <div className="absolute border-2 border-[#000000] border-solid inset-0 pointer-events-none rounded-md" />
      </div>
      <div
        className="absolute bottom-[31.754%] flex flex-col font-['Roboto:Black',_sans-serif] font-black justify-center leading-[0] left-[34.905%] right-[35.906%] text-[#ffffff] text-[13px] text-center text-nowrap top-[31.66%] tracking-[0.52px] uppercase"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          SIGN UP
        </p>
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-[#ffffff] relative size-full">
      <div
        className="absolute bg-center bg-cover bg-no-repeat h-[484px] left-[-32px] top-0 w-[663px]"
        data-name="image 1"
        style={{ backgroundImage: `url('${imgImage1}')` }}
      />
      <Register />
      <Button />
      <Button1 />
    </div>
  );
}