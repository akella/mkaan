"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import Lenis from "lenis";
import ButtonLink from "@/components/ui/ButtonLink";
import Image from "next/image";
import { useForm } from "react-hook-form";
import codes from "@/lib/telCodes";
import SocialLinks from "../ui/SocilaLinks";
import parse, { domToReact } from "html-react-parser";
import useMediaQuery from "@/hooks/useMatchMedia";
import SliderNavButton from "../ui/SliderNavButton";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;

gsap.registerPlugin(ScrollTrigger);

const renderWithoutSpans = (html) => {
  if (!html) return null;

  return parse(html, {
    replace: (domNode) => {
      if (domNode.type === "tag" && domNode.name === "span") {
        return <>{domToReact(domNode.children)}</>;
      }
    },
  });
};

const formatFileSize = (size) => {
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return (
    parseFloat((size / Math.pow(k, i)).toFixed(2)) +
    " " +
    sizes[i].toLowerCase()
  );
};

const FileInput = ({
  name,
  label,
  watch,
  setValue,
  errors,
  required = false,
  register,
}) => {
  const file = watch(name);

  // Register the field manually to connect with react-hook-form validation
  useEffect(() => {
    if (required && register) {
      register(name, { required: `${label} is required` });
    }
  }, [register, name, required, label]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        alert("File size exceeds 4MB");
        return;
      }
      setValue(name, selectedFile, { shouldValidate: true });
      e.target.value = ""; // Reset input value to allow re-uploading same file if needed
    }
  };

  return (
    <div className="relative group w-full">
      <input
        type="file"
        id={name}
        accept=".pdf,.doc,.docx,.txt"
        className="absolute inset-0 opacity-0 pointer-events-none w-px h-px"
        onChange={handleFileChange}
        tabIndex={-1}
      />

      <label
        htmlFor={name}
        className={`cursor-pointer w-full block border-b border-b-brownDark py-4 hover:border-b-textWhite transition-all duration-400 ${
          errors[name] ? "border-b-red" : ""
        }`}
      >
        <span className="block text-11 opacity-40 uppercase mb-1">{label}</span>
        <div className="flex justify-between items-center">
          {file ? (
            <>
              <span className="text-14 text-textWhite truncate max-w-[85%]">
                {file.name}{" "}
                <span className="opacity-40 ml-1">
                  ({formatFileSize(file.size)})
                </span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M0.0833333 4.16667C0.256389 2.97111 0.817014 1.97778 1.76521 1.18667C2.7134 0.395556 3.79167 0 5 0C6.14 0 7.0409 0.265764 7.70271 0.797292C8.36451 1.32882 8.8525 1.82799 9.16667 2.29479V0H10V4.16667H5.83333V3.33333H8.78208C8.5075 2.73722 8.05688 2.17153 7.43021 1.63625C6.80368 1.10097 5.99361 0.833333 5 0.833333C4 0.833333 3.11806 1.14931 2.35417 1.78125C1.59028 2.41319 1.11111 3.20833 0.916667 4.16667H0.0833333ZM12.1667 12.7885L8.21146 8.83333C7.74354 9.22972 7.24118 9.52326 6.70438 9.71396C6.16743 9.90465 5.59931 10 5 10C4.18056 10 3.38917 9.79833 2.62583 9.395C1.8625 8.99167 1.265 8.4284 0.833333 7.70521V10H0V5.83333H4.16667V6.66667H1.21792C1.52458 7.39097 2.01792 7.98875 2.69792 8.46C3.37792 8.93111 4.14528 9.16667 5 9.16667C6 9.16667 6.88194 8.85069 7.64583 8.21875C8.40972 7.58681 8.88889 6.79167 9.08333 5.83333H9.91667C9.84722 6.33333 9.72222 6.76472 9.54167 7.1275C9.36111 7.49014 9.11431 7.86215 8.80125 8.24354L12.7565 12.1987L12.1667 12.7885Z"
                  fill="#F7F7EB"
                />
              </svg>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-14 text-textWhite">
                Upload PDF, DOC/Docx, TXT{" "}
                <span className="opacity-40">(4 mb max)</span>
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M9.58464 12.9808V5.77251L7.64234 7.7148L7.05255 7.11542L10.0013 4.16667L12.9501 7.11542L12.3603 7.7148L10.418 5.77251V12.9808H9.58464ZM5.51422 15.8333C5.13061 15.8333 4.81033 15.7049 4.55339 15.4479C4.29644 15.191 4.16797 14.8707 4.16797 14.4871V12.4679H5.0013V14.4871C5.0013 14.6154 5.0547 14.733 5.16151 14.8398C5.26832 14.9466 5.38589 15 5.51422 15H14.4884C14.6167 15 14.7343 14.9466 14.8411 14.8398C14.9479 14.733 15.0013 14.6154 15.0013 14.4871V12.4679H15.8346V14.4871C15.8346 14.8707 15.7062 15.191 15.4492 15.4479C15.1923 15.7049 14.872 15.8333 14.4884 15.8333H5.51422Z"
                  fill="#F7F7EB"
                />
              </svg>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

const CareerList = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFormShow, setIsModalFormShow] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [articleHeight, setArticleHeight] = useState(0);
  const careerList = useRef(null);
  const scrollProgress = useRef(null);
  const goToTopBtn = useRef(null);
  const scrollDownArrow = useRef(null);
  const closeModalBtn = useRef(null);
  const articleContent = useRef(null);
  const modalContainer = useRef(null);
  const modalLenisRef = useRef(null);
  const modalRafIdRef = useRef(null);
  const formBlock = useRef(null);
  const modalOverscrollAccumulator = useRef(0);
  const isModalFormRevealed = useRef(false);
  const lenis = useLenis();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("scroll-hidden");
      modalContainer.current?.scrollTo({ top: 0 });
      lenis?.stop();
    } else {
      document.body.classList.remove("scroll-hidden");
      lenis?.start();
    }
  }, [isModalOpen, lenis]);

  useEffect(() => {
    if (!isModalOpen || !articleContent.current) return;
    const el = articleContent.current;
    const update = () => setArticleHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isModalOpen, selectedCareer]);

  const scrollToTop = () => {
    if (modalLenisRef.current) {
      modalLenisRef.current.scrollTo(0);
    } else if (modalContainer.current) {
      modalContainer.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollModalToBottom = (event) => {
    event.stopPropagation();

    if (modalLenisRef.current && modalContainer.current) {
      modalLenisRef.current.scrollTo(modalContainer.current.scrollHeight);
    } else if (modalContainer.current) {
      modalContainer.current.scrollTo({
        top: modalContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!isModalOpen || !modalContainer.current || !articleContent.current) {
      return;
    }

    const modalLenis = new Lenis({
      wrapper: modalContainer.current,
      content: articleContent.current,
      smoothWheel: true,
      smoothTouch: true,
      lerp: 0.1,
    });

    modalLenisRef.current = modalLenis;
    requestAnimationFrame(() => ScrollTrigger.refresh());

    const raf = (time) => {
      modalLenis.raf(time);
      modalRafIdRef.current = requestAnimationFrame(raf);
    };

    modalRafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (modalRafIdRef.current) {
        cancelAnimationFrame(modalRafIdRef.current);
      }
      modalLenis.destroy();
      modalLenisRef.current = null;
    };
  }, [isModalOpen]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      gsap.to(closeModalBtn.current, {
        color: "#10070B",
        borderColor: "rgba(16, 7, 11, 0.1)",
        ease: "none",
        scrollTrigger: {
          trigger: careerList.current,
          scroller: modalContainer.current,
          start: "top top",
          toggleActions: "play none none reverse",
        },
      });

      // const header = document.querySelector("header");
      // if (!header) return;
      // gsap.to(header, {
      //   color: "#10070B",
      //   ease: "none",
      //   scrollTrigger: {
      //     trigger: careerList.current,
      //     start: "-1% top",
      //     toggleActions: "play none none reverse",
      //   },
      // });
    });
    mm.add("(min-width: 768px)", () => {
      const lines = gsap.utils.toArray(".js-career-line");
      gsap.set(careerList.current, { gap: "0px" });
      gsap.set(lines, { opacity: 0 });

      gsap.to(careerList.current, {
        gap: "24px",
        scrollTrigger: {
          trigger: careerList.current,
          start: "top 80%",
          end: "30% bottom",
          scrub: true,
        },
      });

      gsap.to(lines, {
        opacity: 1,
        scrollTrigger: {
          trigger: careerList.current,
          start: "top 80%",
          end: "30% bottom",
          scrub: true,
        },
      });

      if (
        scrollDownArrow.current &&
        articleContent.current &&
        modalContainer.current
      ) {
        gsap.to(scrollDownArrow.current, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: articleContent.current,
            scroller: modalContainer.current,
            start: "top top",
            toggleActions: "play none none reverse",

            // markers: true,
          },
        });
      }

      if (articleContent.current && modalContainer.current && isModalOpen) {
        gsap.to(scrollProgress.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: articleContent.current,
            scroller: modalContainer.current,
            start: "-300px top",
            end: "bottom bottom",
            scrub: true,
            // markers: true,
          },
        });
      }
    });
  }, [articleContent, isModalOpen, selectedCareer]);

  // form

  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const codeDropdownRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
    clearErrors,
    trigger,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneCode: "380", // default to Ukraine (+380)
      phoneNumber: "",
      resume: null,
      coverLetter: null,
    },
  });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await fetch(`${API_URL}upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Upload failed with status ${response.status}`,
      );
    }

    const result = await response.json();
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
  };

  const onSubmit = async (data) => {
    if (!API_URL) {
      console.error("NEXT_PUBLIC_STRAPI_API_URL is not defined");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const digitsOnly = (str) => (str || "").replace(/[^0-9]/g, "");
      const phone = `+${digitsOnly(data.phoneCode)}${digitsOnly(
        data.phoneNumber,
      )}`;
      let uploadedResume = null;
      let uploadedCoverLetter = null;

      if (data.resume) {
        uploadedResume = await uploadFile(data.resume);
      }

      if (data.coverLetter) {
        uploadedCoverLetter = await uploadFile(data.coverLetter);
      }

      const applyData = {
        Apply_form: {
          Name: data.fullName?.trim() || "",
          Email: data.email?.trim() || "",
          Phone_number: phone,
          Resume: uploadedResume?.id ?? null,
          Cover_letter: uploadedCoverLetter?.id ?? null,
        },
      };

      const response = await fetch(`${API_URL}job-applies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: applyData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Request failed with status ${response.status}`,
        );
      }

      setIsSubmitted(true);
      setIsModalFormShow(false);
      reset();
    } catch (error) {
      console.error("Error submitting job apply form:", error);
      setSubmitError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors) => {
    console.log("Form Errors: ", errors);
  };

  const handleOpenModal = (career) => {
    setSelectedCareer(career);
    setIsModalFormShow(false);
    setIsSubmitted(false);
    reset();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalFormShow(false);
    setIsSubmitted(false);
    setSelectedCareer(null);
    reset();
  };

  const handleModalClick = (event) => {
    if (
      articleContent.current &&
      articleContent.current.contains(event.target)
    ) {
      return;
    }

    handleCloseModal();
  };

  const handleApplyNowClick = (event) => {
    event.preventDefault();

    const scrollToForm = () => {
      const target = document.getElementById("apply-form");
      if (!target) return;

      if (modalLenisRef.current) {
        modalLenisRef.current.scrollTo(target);
      } else if (modalContainer.current) {
        modalContainer.current.scrollTo({
          top: target.offsetTop,
          behavior: "smooth",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToForm);
    });
  };

  const handleScrollToNextBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const target = document.getElementById("next-block");
    if (!target) return;

    if (modalLenisRef.current) {
      modalLenisRef.current.scrollTo(target);
    } else if (modalContainer.current) {
      modalContainer.current.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <section className="bg-dark relative pl-6 max-md:pl-4 overflow-clip">
        <div
          ref={careerList}
          className="career-list relative grid grid-cols-3 [@media(max-width:1300px)]:grid-cols-2 max-md:!grid-cols-1 gap-6 max-md:gap-4"
        >
          {data.map((career) => (
            <div
              key={career.id}
              className="career-card relative pr-6 pt-6 max-md:pr-4 max-md:pt-4"
            >
              <div
                className={`flex gap-[59px] max-lg:gap-4 max-sm:gap-[27px] p-6 max-md:p-4 ${career.urgent ? "bg-wine" : "bg-textWhite"}  h-[552px] max-md:h-[440px]`}
              >
                <div
                  className={`flex flex-col gap-40 max-md:gap-28 text-14 ${career.urgent ? "text-grayDark" : "text-dark opacity-40"} `}
                >
                  <div>
                    <p>L:</p>
                    <p>T:</p>
                  </div>
                  <p>P:</p>
                </div>
                <div
                  className={`flex flex-col justify-between items-start  pl-6 border-l ${career.urgent ? "border-brownDark text-textWhite" : "border-beige text-dark"}`}
                >
                  <div className="flex flex-col gap-40 max-md:gap-28">
                    <div className="text-14">
                      <p>{career.Hero_section_job.Location}</p>
                      <p>{career.Hero_section_job.Type_of_work}</p>
                    </div>
                    <div className="max-sm:max-w-[87%]">
                      <h3 className="text-36">
                        {career.Hero_section_job.Title}
                      </h3>
                      {career.urgent && (
                        <p className="mt-4 text-11 opacity-40">— Urgent</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenModal(career)}
                    className={`text-14 capitalize group overflow-x-clip relative inline-block after:content-[''] after:absolute after:-bottom-[-1px] after:left-0 after:right-0 after:origin-left after:h-[1px] ${career.urgent ? "after:bg-textWhite" : "after:bg-dark"} hover:after:-scale-x-0 hover:after:origin-right after:transition-transform after:duration-400`}
                  >
                    learn more
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="js-career-line absolute top-6 z-10 w-px h-full bg-brownDark left-[33.3%] [@media(max-width:1300px)]:hidden"></div>
        <div className="js-career-line absolute top-6 z-10 w-px h-full bg-brownDark left-[66.6%] [@media(max-width:1300px)]:left-[50%] max-md:hidden"></div>
      </section>
      {isModalOpen && selectedCareer && (
        <div
          ref={modalContainer}
          data-lenis-prevent
          className="fixed inset-0 z-40 bg-menuOverlay overflow-auto overflow-x-clip career-modal-scroll"
          onClick={handleModalClick}
        >
          <div className="fixed h-[95%] max-md:h-[100px] w-[121px] max-lg:w-[90px] left-0 top-6 z-10 pl-6 max-md:pl-4 flex flex-col justify-between items-start">
            <SliderNavButton
              onClick={handleCloseModal}
              buttonRef={closeModalBtn}
              ariaLabel="Close modal"
              className="text-textWhite border-brownDark duration-600 hover:duration-400 ease-[var(--ease-in-out)] hover:ease-[var(--ease-in)] hover:text-wine"
              fillClassName="bg-textWhite duration-600 group-hover:duration-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="relative z-10"
              >
                <path
                  d="M5.33198 15.2566L4.74219 14.6668L9.40885 10.0001L4.74219 5.33344L5.33198 4.74365L9.99865 9.41032L14.6653 4.74365L15.2551 5.33344L10.5884 10.0001L15.2551 14.6668L14.6653 15.2566L9.99865 10.5899L5.33198 15.2566Z"
                  fill="currentColor"
                />
              </svg>
            </SliderNavButton>
            <SliderNavButton
              onClick={handleScrollToNextBlock}
              buttonRef={scrollDownArrow}
              ariaLabel="Scroll down"
              className="text-textWhite border-brownDark max-md:hidden"
              showFill={false}
              iconClassName=""
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="animated-arrow"
              >
                <path
                  d="M9.58464 4.16663V14.2323L4.75776 9.40538L4.16797 9.99996L10.0013 15.8333L15.8346 9.99996L15.2448 9.40538L10.418 14.2323V4.16663H9.58464Z"
                  fill="currentColor"
                />
              </svg>
            </SliderNavButton>
            <div className="absolute right-0 w-px h-full bg-brown max-md:hidden">
              <div
                ref={scrollProgress}
                className="absolute inset-0 bg-textWhite transform scale-y-0 origin-top"
              ></div>
            </div>
          </div>
          <div
            ref={articleContent}
            id="next-block"
            className="sticky z-0 md:w-[696px] bg-textWhite p-6 max-md:p-4 mt-[376px] md:ml-36 md:mb-6 text-dark max-md:overflow-x-clip"
            style={
              articleHeight > 0
                ? { top: `calc(100dvh - ${articleHeight}px)` }
                : undefined
            }
          >
            <div className="pb-12 max-md:pb-10 border-b border-beige">
              <div className="max-w-1/2 flex flex-col gap-[94px] max-md:gap-[72px] items-start">
                <div className="text-14">
                  <p>{selectedCareer.Hero_section_job.Location}</p>
                  <p>{selectedCareer.Hero_section_job.Type_of_work}</p>
                </div>
                <h3 className="title-h3">
                  {selectedCareer.Hero_section_job.Title}
                </h3>
                <ButtonLink
                  tag="a"
                  href="#apply-form"
                  text={"apply now"}
                  variant={"red"}
                  onClick={handleApplyNowClick}
                  needTransition={false}
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-12 max-md:gap-10 md:max-w-[432px] ml-auto text-14 mt-12 max-md:mt-10 max-md:pl-14">
              {selectedCareer.About_job && (
                <div className="flex flex-col gap-6">
                  <h4 className="text-28">{selectedCareer.About_job.Title}</h4>
                  <p>{selectedCareer.About_job.Description}</p>
                </div>
              )}
              {selectedCareer.Responsibilities ? (
                <div className="flex flex-col gap-6">
                  <h4 className="text-28">
                    {selectedCareer.Responsibilities.Title}
                  </h4>
                  <div className="[&_ul]:list-disc pl-[21px]">
                    {renderWithoutSpans(
                      selectedCareer.Responsibilities.Description,
                    )}
                  </div>
                </div>
              ) : null}
              {selectedCareer.Requirements ? (
                <div className="flex flex-col gap-6">
                  <h4 className="text-28">
                    {selectedCareer.Requirements.Title}
                  </h4>
                  <div className="[&_ul]:list-disc pl-[21px]">
                    {renderWithoutSpans(
                      selectedCareer.Requirements.Description,
                    )}
                  </div>
                </div>
              ) : null}
              {selectedCareer.We_offer ? (
                <div className="flex flex-col gap-6">
                  <h4 className="text-28">{selectedCareer.We_offer.Title}</h4>
                  <div className="[&_ul]:list-disc pl-[21px]">
                    {renderWithoutSpans(selectedCareer.We_offer.Description)}
                  </div>
                </div>
              ) : null}
              {/* <ButtonLink
                onClick={() => setIsModalFormShow(true)}
                text={"apply now"}
                variant={"red"}
                disabled={isModalFormShow}
                className={
                  isModalFormShow ? "opacity-40 pointer-events-none" : ""
                }
              /> */}
            </div>
            <div className="mt-12 pt-12 max-md:pt-10 border-t border-beige flex items-end gap-[195px] max-md:gap-[50px] max-sm:gap-4">
              <SliderNavButton
                onClick={scrollToTop}
                buttonRef={goToTopBtn}
                ariaLabel="Scroll to top"
                className="text-textWhite border-beige"
                showFill={false}
                iconClassName=""
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.58464 15.8333V5.76767L4.75776 10.5945L4.16797 9.99996L10.0013 4.16663L15.8346 9.99996L15.2448 10.5945L10.418 5.76767V15.8333H9.58464Z"
                    fill="#10070B"
                  />
                </svg>
              </SliderNavButton>
              <div className="flex flex-col gap-4">
                <p className="text-14">Share Article</p>
                <SocialLinks
                  isShareLinks={true}
                  variant={"dark"}
                  needCopyBtn={true}
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 md:w-[696px] md:ml-36 max-md:mx-4 mt-6 max-md:mt-4 md:mb-6">
            <div className="relative md:ml-auto md:-mr-[215px] max-w-[calc(480px)] max-md:max-w-full w-full">
            <div
              id="apply-form"
              ref={formBlock}
              className={`relative p-6 max-md:p-4 bg-wine text-textWhite ${isSubmitted ? "pointer-events-none opacity-0" : "pointer-events-auto"} transition-all ease-out delay-0 duration-400`}
            >
              <div className="flex flex-col gap-[72px] max-md:gap-14 pb-12 max-md:pb-10 border-b border-brownDark">
                <p className="text-14 text-grayDark">Apply for</p>
                <p className="title-h3 max-w-[90%]">
                  {selectedCareer.Hero_section_job.Title}
                </p>
              </div>
              <form
                className={`flex flex-col items-start gap-4 max-w-[312px] ml-auto mt-12 max-md:mt-10 `}
                onSubmit={handleSubmit(onSubmit, onError)}
              >
                <div className="relative group w-full">
                  <input
                    {...register("fullName", {
                      required: "Name is required",
                      minLength: {
                        value: 5,
                        message: "Name must be at least 5 characters",
                      },
                    })}
                    id="fullName"
                    type="text"
                    className={`peer text-14 py-4 border-b border-b-brownDark ${
                      errors.fullName ? "border-b-red" : ""
                    } w-full hover:border-b-textWhite transition-all duration-400`}
                    placeholder=" "
                  />
                  {!errors.fullName && (
                    <div className="absolute w-full bottom-0 h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                  )}
                  <label
                    htmlFor="fullName"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-11 transition-all duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                  >
                    Full Name
                  </label>
                </div>

                <div className="relative group w-full">
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      minLength: {
                        value: 5,
                        message: "Email must be at least 5 characters",
                      },
                    })}
                    type="email"
                    className={`peer w-full text-14 py-4 border-b border-b-brownDark ${
                      errors.email ? "border-b-red" : ""
                    } w-full hover:border-b-textWhite transition-all duration-400`}
                    placeholder=" "
                  />
                  {!errors.email && (
                    <div className="absolute w-full bottom-0 h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                  )}
                  <label
                    htmlFor="email"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-11 transition-all duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                  >
                    Email
                  </label>
                </div>
                <div className="flex items-center gap-4 w-full">
                  <div className="relative" ref={codeDropdownRef}>
                    <button
                      type="button"
                      id="phoneCode"
                      className="text-14 w-max py-4 border-b border-b-brownDark bg-transparent hover:border-b-textWhite transition-all duration-400 flex gap-6 items-center justify-between"
                      onClick={() => setIsCodeOpen((v) => !v)}
                      aria-haspopup="listbox"
                      aria-expanded={isCodeOpen}
                    >
                      <span>+{watch("phoneCode")}</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                        className={`transition-transform duration-300 ${
                          isCodeOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <path
                          d="M4.42313 5.01292L0 0.589792L0.589792 0L4.42313 3.83333L8.25646 0L8.84625 0.589792L4.42313 5.01292Z"
                          fill="#F7F7EB"
                        />
                      </svg>
                    </button>
                    <label
                      htmlFor="phoneCode"
                      className="absolute left-0 top-px text-11 opacity-40"
                    >
                      Label
                    </label>
                    {isCodeOpen && (
                      <div
                        onWheel={(e) => {
                          e.stopPropagation();
                        }}
                        role="listbox"
                        className="absolute w-[350px] z-10 left-0 right-0 mt-2 max-h-48 overflow-y-auto  bg-[rgba(58,26,41,0.95)]"
                      >
                        {codes.map((c) => (
                          <div
                            key={c.iso}
                            role="option"
                            aria-selected={watch("phoneCode") === c.code}
                            className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                              watch("phoneCode") === c.code
                                ? "bg-textWhite text-dark"
                                : "hover:bg-[rgba(247,247,235,0.08)]"
                            }`}
                            onClick={() => {
                              setValue("phoneCode", c.code, {
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                              clearErrors("phoneCode");
                              setIsCodeOpen(false);
                            }}
                          >
                            <span>+{c.code}</span>
                            <span className="text-11 opacity-40 ml-2">
                              {c.country}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.phoneCode && (
                      <span className="absolute top-full">
                        {errors.phoneCode.message}
                      </span>
                    )}
                  </div>
                  <div className="relative group w-full">
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder=" "
                      className={`peer w-full text-14 py-4 border-b border-b-brownDark ${
                        errors.phoneNumber ? "border-b-red" : ""
                      } w-full hover:border-b-textWhite transition-all duration-400`}
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9()\s-]{6,}$/,
                          message: "Enter a valid phone number",
                        },
                      })}
                    />
                    <label
                      htmlFor="phoneNumber"
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-11 transition-all duration-400 peer-focus:top-2 peer-[:not(:placeholder-shown)]:top-2 peer-focus:opacity-40 peer-[:not(:placeholder-shown)]:opacity-40"
                    >
                      Phone Number
                    </label>
                    {!errors.phoneNumber && (
                      <div className="absolute w-full bottom-0 h-px bg-textWhite scale-x-0 origin-right md:group-hover:origin-left md:group-hover:scale-x-100 md:transition-transform md:duration-400"></div>
                    )}
                  </div>
                </div>
                <FileInput
                  name="resume"
                  label="Resume"
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  register={register}
                  required={true}
                />
                <FileInput
                  name="coverLetter"
                  label="Cover Letter"
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  register={register}
                  required={true}
                />

                <ButtonLink
                  type="submit"
                  text={isSubmitting ? "Submitting..." : "Submit Resume"}
                  className={"mt-8 max-md:mt-6"}
                  disabled={isSubmitting}
                />
              </form>
            </div>
            <div
              className={`absolute inset-0 p-6 max-md:p-4 bg-wine ${isSubmitted ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity duration-400`}
            >
              <div className="flex flex-col md:gap-24 text-textWhite pb-6 border-b border-brownDark">
                <p className="text-14 text-grayDark">Success</p>
                <div className="max-md:mt-28 max-md:mb-[88px]">
                  <Image
                    src={"/icons/logo-form-big.svg"}
                    width={226}
                    height={144}
                    alt="Logo"
                    className="mx-auto"
                    quality={100}
                  />
                </div>
                <p className="text-36 max-w-[330px]">
                  We Appreciate Your Message and Interest
                </p>
              </div>
              <div className="mt-6">
                <p className="text-14 text-textWhite">
                  We’ll get back to you soon. <br /> Follow us on social media
                  to stay updated.
                </p>
                <div className="flex items-center justify-between mt-[104px]">
                  <SocialLinks />
                  <ButtonLink
                    type="button"
                    onClick={handleCloseModal}
                    text={"Back to Career"}
                  />
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CareerList;
