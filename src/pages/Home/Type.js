import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          '<span class="highlight-blue">Explore interactive dashboard</span>',
          '<span class="highlight-blue"> Discover new anime contents</span>',
          '<span class="highlight-blue"> A website for anime lovers</span>'
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 40,
      }}
    />
  );
}

export default Type;
