﻿(function ($, ssCore, ssEx) {

    window.themeSettings = {
        themeBreakpoint: 1024,
        isAccordionMenu: false
    }

    var previousWidth = ssCore.getViewPort().width;

    function resizeSliders() {
        // set height to the wrapper of the home page sliders and banners so that they are aligned all the same in height
        if (ssCore.getViewPort().width >= 768) {
            var mainSliderHeight = $('.main-banner-1 div').height();
            if (mainSliderHeight != null && mainSliderHeight > 0) {
                $('.banner-wrapper').css("height", mainSliderHeight + "px");
                $('.main-banner-2 .slider-wrapper').css("height", mainSliderHeight + "px");
            }
        }
        else {
            $('.banner-wrapper').css('height', 'auto');
        }
    }

    function resizeAndInitializeFlyoutCart() {
        var previousHeight = ssCore.getViewPort().height;
        var cartCountHeight = $('.mini-shopping-cart .count').height();
        var cartItemHeight = $('.mini-shopping-cart .items').height();
        var cartTotalHeight = $('.mini-shopping-cart .totals').height();
        var cartButtonsHeight = $('.mini-shopping-cart .buttons').height();
        var general = cartCountHeight + cartItemHeight + cartTotalHeight + cartButtonsHeight;

        if (general >= previousHeight) {
            $('.mini-shopping-cart .items').height(previousHeight - 250);
            $('.mini-shopping-cart .items').simplebar();

        }
    }

    function repositionLogoOnWidthBreakpointForHeader2(isInitialLoad, themeBreakpoint) {
        if ($('.header.header-2').length > 0) {
            var viewport = ssCore.getViewPort().width;

            if (isInitialLoad || (viewport > themeBreakpoint && previousWidth <= themeBreakpoint) || (viewport <= themeBreakpoint && previousWidth > themeBreakpoint)) {
                if (viewport >= themeBreakpoint) {
                    $('.header-logo').prependTo('.header-options-wrapper').after($('.store-search-box'));
                }
                else {
                    $('.header-logo').prependTo('.header-actions-wrapper');
                }
            }

            previousWidth = viewport;
        }
    }

    function toggleFooterBlocks(isInitialLoad, themeBreakpoint) {
        var viewport = ssCore.getViewPort().width;

        if (isInitialLoad || (viewport > themeBreakpoint && previousWidth <= themeBreakpoint) || (viewport <= themeBreakpoint && previousWidth > themeBreakpoint)) {
            if (viewport >= themeBreakpoint) {
                $('.footer-block .title').next('div, ul').slideDown();
            }
            else {
                $('.footer-block .title').next('div, ul').slideUp();
            }
        }

        previousWidth = viewport;
    }

    function initializeFlyoutCart(movedElementsSelector, themeBreakpoint) {
        var movedElements = $(movedElementsSelector);

        $('.header .ico-cart').on('click', function (e) {
            var flyoutCart = $('#flyout-cart');

            var flyoutCartCount = $('.flyout-cart .count');
            if (flyoutCartCount.find('.close').length === 0) {
                flyoutCartCount.append('<span class="close"></span>');
            }

            if (ssCore.getViewPort().width > themeBreakpoint) {
                e.preventDefault();

                if (flyoutCart.hasClass('active')) {
                    flyoutCart.removeClass('active');
                    movedElements.removeClass('move-left');
                } else {
                    flyoutCart.addClass('active');
                    movedElements.addClass('move-left');
                }
            }
        });

        $('.flyout-cart .count').append('<span class="close"></span>');

        $('.header').on('click', '#flyout-cart .close', function () {
            $('#flyout-cart').removeClass('active');
            movedElements.removeClass('move-left');
        });
    }
    
    function stretchElementsToBodyWidth(elements) {
        // make categories and blog posts width 100%
        var stretchedElements = $(elements);
        var neededHorizontalMargin = -(parseInt($('body').outerWidth()) * .05);

        stretchedElements.css({
            marginLeft: neededHorizontalMargin,
            marginRight: neededHorizontalMargin
        });
    }
    
    $(document).ready(function () {
        $(window).on('load resize orientationchange', function () {
            if (ssCore.getViewPort().width <= 480) {
                stretchElementsToBodyWidth('.home-page-category-grid, .sub-category-grid, .rich-blog-homepage .blog-posts, .gallery');
            }
            else {
                $('.home-page-category-grid, .sub-category-grid, .rich-blog-homepage .blog-posts, .gallery').css({ 'margin-left': 'auto', 'margin-right': 'auto' });
            }
        });

        var searchBoxBeforeSelector = $('.header-2').length > 0 ? ".header-logo" : ".header-options";

        var responsiveAppSettings = {
            isEnabled: true,
            themeBreakpoint: window.themeSettings.themeBreakpoint,
            isSearchBoxDetachable: true,
            isHeaderLinksWrapperDetachable: false,
            doesDesktopHeaderMenuStick: false,
            doesScrollAfterFiltration: true,
            doesSublistHasIndent: true,
            displayGoToTop: true,
            hasStickyNav: true,
            selectors: {
                menuTitle: ".menu-title",
                headerMenu: ".header-menu",
                closeMenu: ".close-menu span",
                //movedElements: ".admin-header-links, .header-logo, .responsive-nav-wrapper, .master-wrapper-content, .footer, .slider-wrapper",
                sublist: ".header-menu .sublist",
                overlayOffCanvas: ".overlayOffCanvas",
                withSubcategories: ".with-subcategories",
                filtersContainer: ".nopAjaxFilters7Spikes",
                filtersOpener: ".filters-button span",
                searchBoxOpener: ".search-wrap > span",
                searchBox: ".store-search-box",
                searchBoxBefore: searchBoxBeforeSelector,
                navWrapper: ".responsive-nav-wrapper",
                navWrapperParent: ".responsive-nav-wrapper-parent",
                headerLinksOpener: "#header-links-opener",
                headerLinksWrapper: ".header-options-wrapper",
                shoppingCartLink: ".shopping-cart-link",
                overlayEffectDelay: 300
            }
        };

        ssEx.initResponsiveTheme(responsiveAppSettings);

        $(document).on("nopAjaxCartProductAddedToCartEvent nopAjaxCartFlyoutShoppingCartUpdated load", function () {
            resizeAndInitializeFlyoutCart();
        });

        resizeAndInitializeFlyoutCart();

        resizeSliders();

        // click to close (search, header links and mobile menu )

        $('.responsive-nav-wrapper .search-wrap span').on('click', function () {
            if ($('.header-options-wrapper').hasClass('open')) {
                $('.header-options-wrapper').removeClass('open');
            }

            if ($('.header-menu').hasClass('open')) {
                $('.header-menu').removeClass('open');
            }
        });

        $('.responsive-nav-wrapper .personal-button span').on('click', function () {
            if ($('.store-search-box').hasClass('open')) {
                $('.store-search-box').removeClass('open');
            }

            if ($('.header-menu').hasClass('open')) {
                $('.header-menu').removeClass('open');
            }
        });

        $('.menu-title span').on('click', function () {
            if ($('.header-options-wrapper').hasClass('open')) {
                $('.header-options-wrapper').removeClass('open');
            }

            if ($('.store-search-box').hasClass('open')) {
                $('.store-search-box').removeClass('open');
            }
        });

        // footer slide up and down
        $('.footer-block > .title, .footer-1 .newsletter-block .newsletter .title').on('click', function () {
            if (ssCore.getViewPort().width < responsiveAppSettings.themeBreakpoint) {
                $(this).next('div, ul').slideToggle();
            }
        });

        ssEx.addWindowEvent('resize', function () {
            toggleFooterBlocks(false, responsiveAppSettings.themeBreakpoint);
            resizeSliders();
            resizeAndInitializeFlyoutCart();
            repositionLogoOnWidthBreakpointForHeader2(false, responsiveAppSettings.themeBreakpoint);
        });
        ssEx.addWindowEvent('orientationchange', function () {
            toggleFooterBlocks(false, responsiveAppSettings.themeBreakpoint);
            resizeSliders();
            resizeAndInitializeFlyoutCart();
            repositionLogoOnWidthBreakpointForHeader2(false, responsiveAppSettings.themeBreakpoint);
        });

        toggleFooterBlocks(true, responsiveAppSettings.themeBreakpoint);
        repositionLogoOnWidthBreakpointForHeader2(true, responsiveAppSettings.themeBreakpoint);

        initializeFlyoutCart(responsiveAppSettings.selectors.movedElements, responsiveAppSettings.themeBreakpoint);

        ssCore.loadImagesOnScroll();
    });

    $(document).on("nopAnywhereSlidersFinishedLoading", function () {
        resizeSliders();
        $('.main-banner-2').show();
    });

})(jQuery, sevenSpikesCore, sevenSpikesEx);