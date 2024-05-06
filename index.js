
window.addEventListener("DOMContentLoaded", (event) => {

    // Text Spliting Code: Splits any tag with 'split-text' attribute
    gsap.registerPlugin(SplitType)
    let textSplit;

    function splitText() {
        textSplit = new SplitType("[split-text]", {
            types: "lines, words, chars",
            tagName: "span"
        });
    }
    splitText();

    // Splits the text again after changes of screen size 
    let windowWidth = window.innerWidth;
    window.addEventListener("resize", function () {
        if (windowWidth !== window.innerWidth) {
            windowWidth = window.innerWidth;
            textSplit.revert();
            splitText();
        }
    });

    // Pre Loader Animation
    let homeLoadTl = gsap.timeline();
    const desktopPreloaderAnimation = () => {
        homeLoadTl
            .to(".loader_colums", {
                delay: 0.5,
                yPercent: -100,
                duration: 1.6,
                stagger: {
                    each: 0.1
                },
                ease: "power4.inOut",
                onComplete: () => {
                    $(".loader_component").css("display", "none");
                }
            })
            .from(
                ".hero_heading-wrapper .char", {
                yPercent: 100,
                duration: 0.8,
                stagger: {
                    amount: 0.5
                },
                ease: "power3.out"
            },
                "-=1"
            )
            .from(
                ".hero_sub-text-wrap .word", {
                yPercent: 100,
                duration: 1,
                ease: "power2.out"
            },
                "<45%"
            )
            .from(
                ".hero_background-image-wrap", {
                scale: 1.5,
                ease: "power1.inOut",
                duration: 2.5
            },
                0
            )
    };
    const mobilePreloaderAnimation = () => {
        homeLoadTl
            .to(".loader_colums", {
                delay: 0.5,
                xPercent: -100,
                duration: 1.6,
                stagger: {
                    each: 0.1
                },
                ease: "power4.inOut",
                onComplete: () => {
                    $(".loader_component").css("display", "none");
                }
            })
            .from(
                ".hero_heading-wrapper .char", {
                yPercent: 100,
                duration: 0.8,
                stagger: {
                    amount: 0.5
                },
                ease: "power3.out"
            },
                "-=1"
            )
            .from(
                ".hero_sub-text-wrap .word", {
                yPercent: 100,
                duration: 1,
                ease: "power2.out"
            },
                "<45%"
            )
            .from(
                ".hero_background-image-wrap", {
                scale: 1.5,
                ease: "power1.inOut",
                duration: 2.5
            },
                0
            );
    };
    let preLoaderMm = gsap.matchMedia();
    preLoaderMm.add("(min-width: 480px)", () => {
        desktopPreloaderAnimation();
    });
    preLoaderMm.add("(max-width: 479px)", () => {
        mobilePreloaderAnimation();
    });

    // Responsive Animations Using Match Media

    const desktopAnimate = () => {

        // Navbar Animations
        let navMenuTl = gsap.timeline({
            paused: true,
            onStart: () => {
                $(".nav_menu_component").css("display", "block");
            },
            onReverseComplete: () => {
                $(".nav_menu_component").css("display", "none");
            }
        });

        navMenuTl
            .from(".nav_menu_link", {
                xPercent: 100,
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut",
                stagger: {
                    each: 0.1
                }
            })
            .from(
                ".nav_menu_other-links .text-link_wrap", {
                opacity: 0,
                ease: "power2.out",
                yPercent: -40,
                duration: 0.3
            },
                ">-=0.5"
            )
            .from(
                ".nav_menu_close-trigger", {
                opacity: 0,
                ease: "power2.out",
                duration: 1.6
            },
                0
            );

        // Nav Icons Animations
        let navMenuIconTl = gsap.timeline({
            paused: true,
            defaults: {
                duration: 0.8,
                ease: "power2.inOut"
            }
        });

        navMenuIconTl
            .to(".nav_icon-line:nth-of-type(2)", {
                yPercent: 100
            })
            .to(
                ".nav_icon-line:nth-of-type(1)", {
                rotate: 22.5
            },
                0
            )
            .to(
                ".nav_icon-line:nth-of-type(3)", {
                rotate: -22.5
            },
                0
            );


        // Checking If Navbar Is Closed Or Open To Perform The Animation
        $(".nav_bar").on("click", function () {
            $(this).toggleClass("clicked");
            if ($(this).hasClass("clicked")) {
                navMenuTl.timeScale(1).restart();
                navMenuIconTl.restart();
            } else {
                navMenuTl.timeScale(1.5).reverse();
                navMenuIconTl.reverse();
            }
        });

        // When Nav Close Trigger Clicked
        $(".nav_menu_close-trigger").on("click", function () {
            $(".nav_bar").toggleClass("clicked");
            navMenuTl.timeScale(1.5).reverse();
            navMenuIconTl.reverse();
        });

        // Calculates the width of all sections and sets it to height of scrolling tag
        // For better scrolling experience 
        function setTrackHeights() {
            $(".horizontal-scroll_section-height").each(function (index) {
                let trackWidth = $(this).find(".horizontal-scroll_track").outerWidth();
                $(this).height(trackWidth);
            });
        }
        setTrackHeights();
        window.addEventListener("resize", function () {
            setTrackHeights();
        });

        // Add Horizontal Scroll
        let horizontalMainTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".horizontal-scroll_section-height",
                start: "top top",
                end: "bottom bottom",
                scrub: 2
            }
        });

        horizontalMainTl.to(".horizontal-scroll_track", {
            xPercent: -100,
            ease: "none",
            onUpdate: updateScrollProgress
        });

        // Setting Progress To 0 
        $(".nav_progress-number").text(0);

        // Setting Progress On Update
        function updateScrollProgress() {
            let progress = Math.round(horizontalMainTl.progress() * 100);
            $(".nav_progress-number").text(progress);
        }

        // Add paralllax to the hero image on scroll
        let heroImageTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section_hero",
                containerAnimation: horizontalMainTl,
                scrub: true,
                start: "left left",
                end: "right left"
            }
        });

        heroImageTl.to(".hero_background-image", {
            x: "30vw",
            ease: "none"
        });

        // Change Nav State On Scroll
        let navStatesTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".section_hero",
                toggleActions: "restart none none reverse",
                containerAnimation: horizontalMainTl,
                start: "0.5rem left",
                end: "0.6rem left",
            }
        });

        navStatesTl
            .to(".nav_logo-wrap, .nav_logo-text.is-top", {
                opacity: 0,
                duration: 0.3,
                ease: "power3.out"
            })
            .to(".nav_logo-embed", {
                opacity: 1,
                duration: 0.3,
                ease: "power3.out"
            });
    };

    const mobileAnimate = () => { };

    let pageAnimationMm = gsap.matchMedia();

    pageAnimationMm.add('(min-width: 768px)', () => {
        desktopAnimate();
    });
    pageAnimationMm.add('(max-width: 767px)', () => {
        mobileAnimate();
    });

});