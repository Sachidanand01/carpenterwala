'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function BlogActionBar({ title, slug, canonicalUrl }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showSavePopover, setShowSavePopover] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const popoverRef = useRef(null);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('carpenterwala_saved_blogs') || '[]');
      if (savedList.some((item) => item.slug === slug)) {
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Error reading saved articles from localStorage', e);
    }
  }, [slug]);

  // Handle clicking outside the popover to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowSavePopover(false);
      }
    }
    if (showSavePopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSavePopover]);

  const handleSaveToggle = () => {
    try {
      const savedList = JSON.parse(localStorage.getItem('carpenterwala_saved_blogs') || '[]');
      let updated;
      if (isSaved) {
        updated = savedList.filter((item) => item.slug !== slug);
        setIsSaved(false);
        setToastMessage('Removed from bookmarks');
      } else {
        updated = [...savedList, { slug, title, url: canonicalUrl, savedAt: new Date().toISOString() }];
        setIsSaved(true);
        setToastMessage('Article saved to bookmarks! 🔖');
        setShowSavePopover(true);
      }
      localStorage.setItem('carpenterwala_saved_blogs', JSON.stringify(updated));

      setTimeout(() => {
        setToastMessage('');
      }, 3000);
    } catch (e) {
      console.error('Error saving article to localStorage', e);
    }
  };

  const encodedPrompt = encodeURIComponent(`Please provide a concise, structured summary and key takeaways of this guide: ${canonicalUrl}`);

  const aiTools = [
    {
      name: 'ChatGPT',
      url: `https://chatgpt.com/?q=${encodedPrompt}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <g clip-path="url(#a)">
            <mask id="b" width="20" height="20" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:luminance">
              <path fill="#fff" d="M20 0H0v20h20z" />
            </mask>
            <g mask="url(#b)">
              <path fill="#3b3d4a" d="M18.21 8.373a4.773 4.773 0 0 0-5.12-6.526 4.772 4.772 0 0 0-8.21 1.174 4.773 4.773 0 0 0-3.089 7.697 4.773 4.773 0 0 0 3.18 6.413c.406.11.824.168 1.244.17q.35 0 .697-.052a4.773 4.773 0 0 0 8.208-1.174 4.774 4.774 0 0 0 3.09-7.698zm-3.535-5.098a3.41 3.41 0 0 1 2.434 4.091 4 4 0 0 0-.248-.154l-3.793-2.194a.68.68 0 0 0-.681 0l-3.75 2.166V5.609l3.451-1.993a3.4 3.4 0 0 1 2.587-.34m-3.311 7.058L10 11.12l-1.363-.787V8.758L10 7.971l1.364.787zm-5.455-5.56A3.409 3.409 0 0 1 11.665 2.3c-.085.044-.17.085-.256.138L7.614 4.625a.68.68 0 0 0-.341.59v4.33l-1.364-.787zM2.573 6.045A3.4 3.4 0 0 1 4.556 4.48q-.01.147-.01.293v4.379a.68.68 0 0 0 .34.59l3.75 2.165-1.363.792-3.452-1.997a3.41 3.41 0 0 1-1.248-4.657m2.752 9.77a3.41 3.41 0 0 1-2.434-4.09q.121.08.248.154l3.793 2.194a.68.68 0 0 0 .682 0l3.75-2.166v1.575l-3.452 1.993a3.4 3.4 0 0 1-2.587.34m8.766-1.497a3.408 3.408 0 0 1-5.754 2.476q.127-.065.255-.139l3.794-2.19a.68.68 0 0 0 .341-.59v-4.33l1.364.788zm3.336-1.272a3.4 3.4 0 0 1-1.982 1.565q.009-.146.01-.293V9.94a.68.68 0 0 0-.341-.59l-3.75-2.165 1.363-.788L16.18 8.39a3.41 3.41 0 0 1 1.248 4.657" />
            </g>
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M0 0h20v20H0z" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      name: 'Claude',
      url: `https://claude.ai/new?q=${encodedPrompt}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path fill="#3b3d4a" d="m5.927 15.3 3.933-2.207.066-.191-.066-.107h-.192l-.657-.04-2.247-.061-1.95-.081-1.887-.101-.476-.102-.445-.587.046-.293.4-.268.572.05 1.264.086 1.898.13 1.377.082 2.04.212h.323l.046-.131-.11-.081-.087-.081-1.964-1.33-2.126-1.407-1.113-.81-.602-.41-.304-.385-.13-.84.546-.602.734.05.188.05.744.573 1.588 1.23 2.075 1.527.303.252.122-.086.015-.06-.137-.229-1.128-2.04-1.204-2.074-.536-.86-.142-.515a2.5 2.5 0 0 1-.086-.607l.622-.845L7.584 2l.83.11.35.304.516 1.18.835 1.857 1.296 2.526.38.749.202.693.075.212h.131V9.51l.107-1.423.197-1.746.191-2.248.066-.633.314-.758.622-.41.486.232.4.572-.056.37-.238 1.544-.465 2.419-.304 1.62h.177l.202-.203.82-1.088 1.376-1.721.608-.683.708-.754.455-.36h.86l.633.941-.284.972-.885 1.123-.734.951-1.053 1.418-.657 1.133.06.09.157-.014 2.378-.506 1.285-.232 1.534-.263.693.324.076.329-.273.673-1.64.405-1.923.385-2.864.678-.035.025.04.05 1.29.122.553.03h1.35l2.517.187.657.434.394.532-.066.405-1.012.516-1.366-.324-3.188-.759-1.094-.272h-.15v.09l.91.891 1.67 1.508 2.09 1.943.107.48-.268.38-.284-.04-1.837-1.383-.709-.622-1.604-1.351h-.107v.142l.37.541 1.953 2.936.101.9-.142.293-.506.177-.556-.102-1.143-1.605-1.18-1.807-.951-1.62-.116.067-.562 6.048-.263.309-.607.232-.506-.385-.269-.622.269-1.23.324-1.604.263-1.276.237-1.584.142-.527-.01-.035-.115.015-1.195 1.64-1.817 2.455-1.437 1.539-.344.136-.597-.309.055-.552.334-.491 1.99-2.531 1.2-1.568.774-.906-.006-.131h-.045l-5.284 3.43-.941.122-.405-.379.05-.622.191-.203 1.589-1.093-.005.006z" />
        </svg>
      )
    },
    {
      name: 'Gemini',
      url: `https://gemini.google.com/app?q=${encodedPrompt}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <g clip-path="url(#a)">
            <mask id="b" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:luminance">
              <path fill="#fff" d="M24 0H0v24h24z" />
            </mask>
            <g mask="url(#b)">
              <mask id="d" width="20" height="20" x="2" y="2" maskUnits="userSpaceOnUse" style="mask-type:alpha">
                <path fill="#000" d="M12 2c.21 0 .392.143.444.347q.235.934.615 1.82a12.8 12.8 0 0 0 2.73 4.045 12.85 12.85 0 0 0 5.865 3.345.458.458 0 0 1 0 .886q-.936.236-1.82.617a12.9 12.9 0 0 0-4.046 2.728 12.85 12.85 0 0 0-3.345 5.866.458.458 0 0 1-.886 0 12.83 12.83 0 0 0-3.345-5.865 12.85 12.85 0 0 0-5.865-3.346.457.457 0 0 1 0-.886q.934-.234 1.82-.616a12.8 12.8 0 0 0 4.045-2.729 12.84 12.84 0 0 0 3.345-5.865A.46.46 0 0 1 12 2" />
                <path fill="url(#c)" d="M12 2c.21 0 .392.143.444.347q.235.934.615 1.82a12.8 12.8 0 0 0 2.73 4.045 12.85 12.85 0 0 0 5.865 3.345.458.458 0 0 1 0 .886q-.936.236-1.82.617a12.9 12.9 0 0 0-4.046 2.728 12.85 12.85 0 0 0-3.345 5.866.458.458 0 0 1-.886 0 12.83 12.83 0 0 0-3.345-5.865 12.85 12.85 0 0 0-5.865-3.346.457.457 0 0 1 0-.886q.934-.234 1.82-.616a12.8 12.8 0 0 0 4.045-2.729 12.84 12.84 0 0 0 3.345-5.865A.46.46 0 0 1 12 2" />
              </mask>
              <g mask="url(#d)">
                <g filter="url(#e)">
                  <path fill="#3b3d4a" d="M.195 17.636c2.31.82 4.967-.718 5.932-3.437s-.125-5.588-2.436-6.408-4.967.718-5.932 3.436c-.966 2.72.125 5.589 2.436 6.41" />
                </g>
                <g filter="url(#f)">
                  <path fill="#3b3d4a" d="M10.455 8.672c3.175 0 5.748-2.63 5.748-5.874 0-3.245-2.573-5.875-5.748-5.875-3.174 0-5.748 2.63-5.748 5.875s2.573 5.874 5.748 5.874" />
                </g>
                <g filter="url(#g)">
                  <use href="#h" />
                </g>
                <g filter="url(#i)">
                  <use href="#h" />
                </g>
                <g filter="url(#j)">
                  <path fill="#3b3d4a" d="M11.54 24.863c2.779-1.69 3.522-5.54 1.661-8.599s-5.621-4.168-8.4-2.478-3.522 5.54-1.661 8.6c1.862 3.058 5.622 4.167 8.4 2.477" />
                </g>
                <g filter="url(#k)">
                  <path fill="#3b3d4a" d="M22.77 15.25c3.122 0 5.654-2.438 5.654-5.444 0-3.007-2.532-5.445-5.654-5.445-3.123 0-5.654 2.438-5.654 5.445s2.531 5.444 5.654 5.444" />
                </g>
                <g filter="url(#l)">
                  <path fill="#3b3d4a" d="M-2.026 14.619c2.875 2.186 7.076 1.5 9.382-1.532s1.845-7.264-1.03-9.45C3.45 1.45-.75 2.135-3.056 5.167s-1.845 7.265 1.03 9.451" />
                </g>
                <g filter="url(#m)">
                  <path fill="#3b3d4a" d="M12.707 17.85c3.432 2.36 7.981 1.703 10.16-1.468 2.18-3.17 1.165-7.653-2.267-10.012s-7.98-1.703-10.16 1.467-1.165 7.654 2.267 10.014" />
                </g>
                <g filter="url(#n)">
                  <path fill="#3b3d4a" d="M18.946 1.28c.873 1.187-.249 3.495-2.506 5.155s-4.794 2.044-5.667.857.248-3.495 2.505-5.155c2.258-1.66 4.795-2.044 5.668-.857" />
                </g>
                <g filter="url(#o)">
                  <path fill="#3b3d4a" d="M11.779 6.963c3.49-3.238 4.688-7.621 2.676-9.791C12.442-4.998 7.98-4.132 4.49-.894S-.199 6.727 1.814 8.897s6.474 1.304 9.965-1.934" />
                </g>
                <g filter="url(#p)">
                  <path fill="#3b3d4a" d="M4.623 18.593c2.075 1.485 4.457 1.71 5.32.504s-.118-3.388-2.193-4.873c-2.074-1.485-4.457-1.71-5.32-.504-.863 1.207.118 3.388 2.193 4.873" />
                </g>
              </g>
            </g>
          </g>
          <defs>
            <filter id="e" width="12.705" height="13.92" x="-4.41" y="5.753" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation=".908" />
            </filter>
            <filter id="f" width="29.059" height="29.312" x="-4.074" y="-11.858" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="4.391" />
            </filter>
            <filter id="g" width="26.956" height="30.488" x="-5.637" y="4.442" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="3.733" />
            </filter>
            <filter id="i" width="26.956" height="30.488" x="-5.637" y="4.442" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="3.733" />
            </filter>
            <filter id="j" width="27.041" height="27.588" x="-5.35" y="5.531" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="3.733" />
            </filter>
            <filter id="k" width="25.496" height="25.076" x="10.022" y="-2.733" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="3.547" />
            </filter>
            <filter id="l" width="26.206" height="26.399" x="-10.954" y="-4.072" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="3.215" />
            </filter>
            <filter id="m" width="26.208" height="25.796" x="3.55" y="-.788" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="2.871" />
            </filter>
            <filter id="n" width="19.041" height="17.666" x="5.339" y="-4.547" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="2.569" />
            </filter>
            <filter id="o" width="23.272" height="22.794" x="-3.502" y="-8.363" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="2.17" />
            </filter>
            <filter id="p" width="18.882" height="17.67" x="-3.254" y="7.574" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur_5142_3218" stdDeviation="2.685" />
            </filter>
            <linearGradient id="c" x1="7.685" x2="18.073" y1="15.382" y2="6.624" gradientUnits="userSpaceOnUse">
            </linearGradient>
            <path id="h" fill="#3b3d4a" d="M8.221 27.46c3.314-.162 5.83-3.774 5.62-8.067s-3.066-7.642-6.38-7.48-5.83 3.773-5.62 8.067c.21 4.293 3.066 7.642 6.38 7.48" />
          </defs>
        </svg>
      )
    },
    {
      name: 'Perplexity',
      url: `https://www.perplexity.ai/search?q=${encodedPrompt}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <g clip-path="url(#a)">
            <path fill="#3b3d4a" fill-rule="evenodd" d="m5.896 1.5 5.98 5.51V1.513h1.164v5.521L19.046 1.5v6.282h2.467v9.06h-2.46v5.594l-6.013-5.284v5.345h-1.164v-5.258L5.903 22.5v-5.658H3.437v-9.06h2.459zm5.102 7.431H4.601v6.762h1.3V13.56zM7.067 14.07v5.864l4.809-4.235V9.702zm6.006 1.573V9.696l4.81 4.369v2.777h.007v3.032zm5.98.05h1.295V8.93h-6.35l5.056 4.58zm-1.17-7.911V4.145l-3.948 3.637zm-6.876 0H7.06V4.145z" clip-rule="evenodd" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M2.437 1.043h19.127v21.913H2.437z" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      name: 'Grok',
      url: `https://x.com/i/grok?text=${encodedPrompt}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <g fill="#3b3d4a" clip-path="url(#a)">
            <path d="m9.787 14.671 6.518-4.818c.32-.236.777-.144.929.223.801 1.935.443 4.26-1.151 5.857-1.595 1.596-3.813 1.946-5.841 1.149l-2.215 1.027c3.177 2.174 7.035 1.636 9.446-.78 1.913-1.914 2.505-4.524 1.951-6.878l.005.005c-.803-3.457.198-4.839 2.247-7.665l.146-.203-2.697 2.7V5.28l-9.34 9.393m-1.343 1.169c-2.28-2.181-1.888-5.557.058-7.503 1.439-1.44 3.797-2.029 5.854-1.164l2.21-1.022a6.4 6.4 0 0 0-1.493-.816 7.33 7.33 0 0 0-7.968 1.605C5.033 9.014 4.383 12.2 5.5 14.919c.835 2.032-.534 3.47-1.912 4.92-.489.514-.979 1.028-1.374 1.573l6.226-5.568" />
          </g>
          <defs>
            <clipPath id="a">
              <path fill="#fff" d="M2 2.294h20v19.412H2z" />
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      name: 'Copilot',
      url: `https://copilot.microsoft.com/?q=${encodedPrompt}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
          <path fill="url(#a)" d="M34.142 7.325A4.63 4.63 0 0 0 29.7 4h-1.35a4.63 4.63 0 0 0-4.554 3.794L21.48 20.407l.575-1.965a4.63 4.63 0 0 1 4.444-3.33h7.853l3.294 1.282 3.175-1.283h-.926a4.63 4.63 0 0 1-4.443-3.325z" />
          <path fill="url(#b)" d="M14.33 40.656A4.63 4.63 0 0 0 18.779 44h2.87a4.63 4.63 0 0 0 4.629-4.51l.312-12.163-.654 2.233a4.63 4.63 0 0 1-4.443 3.329h-7.919l-2.823-1.532-3.057 1.532h.912a4.63 4.63 0 0 1 4.447 3.344l1.279 4.423z" />
          <path fill="url(#c)" d="M29.5 4H13.46c-4.583 0-7.332 6.057-9.165 12.113C2.123 23.29-.72 32.885 7.503 32.885h6.925a4.63 4.63 0 0 0 4.456-3.358 2079 2079 0 0 1 4.971-17.156c.843-2.843 1.544-5.284 2.621-6.805C27.08 4.714 28.086 4 29.5 4" />
          <path fill="url(#d)" d="M29.5 4H13.46c-4.583 0-7.332 6.057-9.165 12.113C2.123 23.29-.72 32.885 7.503 32.885h6.925a4.63 4.63 0 0 0 4.456-3.358 2079 2079 0 0 1 4.971-17.156c.843-2.843 1.544-5.284 2.621-6.805C27.08 4.714 28.086 4 29.5 4" />
          <path fill="url(#e)" d="M18.498 44h16.04c4.582 0 7.332-6.058 9.165-12.115 2.171-7.177 5.013-16.775-3.208-16.775h-6.926a4.63 4.63 0 0 0-4.455 3.358 2084 2084 0 0 1-4.972 17.16c-.842 2.843-1.544 5.285-2.62 6.806-.604.852-1.61 1.566-3.024 1.566" />
          <path fill="url(#f)" d="M18.498 44h16.04c4.582 0 7.332-6.058 9.165-12.115 2.171-7.177 5.013-16.775-3.208-16.775h-6.926a4.63 4.63 0 0 0-4.455 3.358 2084 2084 0 0 1-4.972 17.16c-.842 2.843-1.544 5.285-2.62 6.806-.604.852-1.61 1.566-3.024 1.566" />
          <defs>
            <radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="rotate(230.696 23.861 1.255)scale(17.3033 16.2706)" gradientUnits="userSpaceOnUse">
              <stop offset=".096" />
              <stop offset=".773" />
              <stop offset="1" />
            </radialGradient>
            <radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="rotate(51.84 -28.201 27.85)scale(15.9912 15.5119)" gradientUnits="userSpaceOnUse">
              <stop />
              <stop offset=".634" />
              <stop offset=".923" />
            </radialGradient>
            <radialGradient id="e" cx="0" cy="0" r="1" gradientTransform="rotate(109.274 16.301 20.802)scale(38.3873 45.9867)" gradientUnits="userSpaceOnUse">
              <stop offset=".066" />
              <stop offset=".5" />
              <stop offset=".896" />
            </radialGradient>
            <linearGradient id="c" x1="12.5" x2="14.788" y1="7.5" y2="33.975" gradientUnits="userSpaceOnUse">
              <stop offset=".156" />
              <stop offset=".487" />
              <stop offset=".652" />
              <stop offset=".937" />
            </linearGradient>
            <linearGradient id="d" x1="14.5" x2="15.75" y1="4" y2="32.885" gradientUnits="userSpaceOnUse">
              <stop />
              <stop offset=".247" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="f" x1="42.586" x2="42.569" y1="13.346" y2="21.215" gradientUnits="userSpaceOnUse">
              <stop offset=".058" />
              <stop offset=".708" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div className="blog-action-bar-wrapper" style={{ position: 'relative', zIndex: 30 }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          border: '1px solid var(--primary)',
          fontSize: '0.9rem',
          fontWeight: '500',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.25s ease'
        }}>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="blog-action-bar-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        padding: '1rem 1.5rem',
        margin: '2rem 0 1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
        borderRadius: '14px',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Left Section: Summarize with AI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--foreground)',
            letterSpacing: '0.2px'
          }}>
            Summarize with:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {aiTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Summarize with ${tool.name}`}
                aria-label={`Summarize article using ${tool.name}`}
                className="ai-tool-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
              >
                {tool.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: Save (Bookmark) & Preferred on Google CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', position: 'relative' }}>

          {/* Save Button */}
          <div style={{ position: 'relative' }} ref={popoverRef}>
            <button
              onClick={handleSaveToggle}
              className="action-btn-save"
              aria-label={isSaved ? "Remove from saved articles" : "Save article for later"}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                backgroundColor: isSaved ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                border: isSaved ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isSaved ? 'var(--primary)' : '#0f172a',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{isSaved ? 'Saved' : 'Save'}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>

            {/* Popover / Tooltip when saved */}
            {showSavePopover && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '260px',
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '1rem',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                zIndex: 100,
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#f8fafc', fontWeight: '600' }}>
                    Sign in to save for later
                  </p>
                  <button
                    onClick={() => setShowSavePopover(false)}
                    aria-label="Close save popover"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                      lineHeight: 1
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                  Create a free account or sign in to sync your bookmarked guides across all your devices.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href="/login"
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      borderRadius: '6px'
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      borderRadius: '6px'
                    }}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Add as preferred on Google Button */}
          <a
            href="https://www.google.com/preferences/source?q=carpenterwala.com"
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn-google"
            aria-label="Add Carpenterwala as preferred source on Google"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.5rem 1.05rem',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              fontSize: '0.88rem',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
          >
            {/* Google Multi-Color G Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Add as preferred on Google</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        .ai-tool-btn:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          border-color: var(--primary) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }
        .action-btn-save:hover {
          background-color: rgba(255, 255, 255, 0.12) !important;
          transform: translateY(-1px);
        }
        .action-btn-google:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        @media (max-width: 768px) {
          .blog-action-bar-container {
            flex-direction: column;
            align-items: stretch !important;
            padding: 1rem !important;
          }
          .blog-action-bar-container > div {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
