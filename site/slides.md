---
title: AI Imager
info: |
  ## Welcome to AI Imager
  This is a presentation about the architecture and implementation of this educational unit. It contains references for further study and ideas how to evolve the project.
theme: seriph
themeConfig:
  primary: '#1034a6'
layout: image
image: ./ai_imager_logo.svg
backgroundSize: contain
class: bg-blue
transition: slide-up
hideInToc: true
highlighter: shiki
colorSchema: light
---

<style>
  .bg-blue {
    background-color: #12aefe;
  }
  .shadow-icon {
    filter: drop-shadow(2px 4px 6px #000000);
  }
</style>

<div class="pt-12 absolute bottom-1 left-0 right-0 text-center">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10" color="black">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/evarga/ai-imager" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white shadow-icon">
    <carbon-logo-github />
  </a>
</div>

---

# Navigation

Hover in the bottom-left corner to see the navigation's controls panel, [learn more](https://sli.dev/guide/navigation.html).

## Keyboard Shortcuts

|     |     |
| --- | --- |
| <kbd>right</kbd> / <kbd>space</kbd>| next animation or slide |
| <kbd>left</kbd>  / <kbd>shift</kbd><kbd>space</kbd> | previous animation or slide |
| <kbd>up</kbd> | previous slide |
| <kbd>down</kbd> | next slide |

<img
  v-click
  class="absolute -bottom-9 -left-7 w-80 opacity-50"
  src="https://sli.dev/assets/arrow-bottom-left.svg"
  alt=""
/>
<p v-after class="absolute bottom-23 left-45 opacity-30 transform -rotate-10">Hover over here!</p>

---
hideInToc: true
---

# Table of Contents

<Toc minDepth="1" maxDepth="2"></Toc>

---

# Use Cases

Use cases are important in scoping a product and understanding the behavioral requirements, through which a user achieves their
goals by using a system. Use cases can be visualized in many ways, via UML use case diagrams, user journeys, etc. A [user journey diagram](https://mermaid.js.org/syntax/userJourney.html) depicts various actors taking actions in use cases. This helps figure out who is doing what and when to complete each usage scenario.

A use case (or user journey) diagram is not a formal decription of use cases or requirements of a system. These must be separately handled and specified.

---
layout: center
---

```mermaid {theme: 'neutral', scale: 0.6}
journey
    title Main Usage Scenarios
    section Set up access keys and token
      Configure deployment token for static hosting in Azure: 3: Administrator
    section Analyse Image
      Specify image URL: 4: User
      Analyse image and provide description: 5: AI Imager
      Read description of image: 5: User
    section Generate Image
      Describe image: 4: User
      Read description and generate image: 5: AI Imager
      Watch and save image: 5: User
```

---
layout: section
---

# Architecture and Design

---

## What is a Mashup?

A *mashup* is a computer industry jargon that denotes a <span v-mark.underline.orange>hybrid web application</span> capable of combining data and services from various sources. This project is an example of a so-called *consumer mashup*, since it provides a new aggregated service on top of external ones, which are enrolled below:

- [Azure AI Vision Image Analysis](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-image-analysis?tabs=4-0)
- [OpenAI](https://openai.com)

Auxiliary cloud services that help implement the web application (including deployment and monitoring) are not considered part of a mashup, since these are not directly perciveable by end users nor deliver functionalities to address major uses cases. For example, this project uses [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/overview) service for deployment, although it is not counting toward being part of a mashup.

---
transition: fade-out
---

## Visualizing a Software Architecture

<v-clicks>

- The [C4 model](https://c4model.com) is superb for visualizing software architecture. There are several diagram types each with various abstraction levels. This project combines the [system context diagram](https://c4model.com/#SystemContextDiagram) and the [container diagram](https://c4model.com/#ContainerDiagram) into something that could be called as *expanded system context* diagram. It shows both the system boundary and major constituent parts of the web application. The main advantages of C4 are its flexibility and informal treatment of diagrams, which allows omitting details not relevant for understanding the content.

- A crucial aspect of any visualization system is to keep diagram specifications inside the same version control system where the rest of source code lives. Placing diagrams near code ensures that they will stay in sync with a target system. Furthermore, working with textual diagram files is a more developer friendly experience and allows all sorts of automations. For example, it is possible to transform textual representations into many target formats. This project uses [Mermaid](https://mermaid.js.org) for this purpose.<sup v-if="$clicks >= 2">*</sup>

- Another advantage of keeping diagrams in textual format is adherence to the [seperation of concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) principle. There is no need to worry about nuances of visual rendering while focusing on essential elements of a diagram (like, what entities to show, how they are related, etc.). Isolating these aspects makes it easy to apply various themes and styles to change the final appereance.

</v-clicks>

<p v-if="$clicks >= 2" class="mt-5 text-sm opacity-75">
  * There are other tools of this sort, but Mermaid is well integrated into Slidev.
</p>

---
layout: center
---

```mermaid {theme: 'neutral', scale: 0.47}
C4Context
    Person_Ext(user_a, "User", "A user of the system.")
    System_Boundary(s1, "AI Imager") {
        Container(spa, "Single-Page App", "JavaScript, React", "Main entry point of the system.")
        Container_Boundary(c1, "Modules") {
            Container(img_analyzer, "Image Analyzer", "JavaScript", "Talks to Azure AI Vision.")
            Container(img_generator, "Image Generator", "JavaScript", "Communicates with OpenAI.")
        }  
    }
    System_Boundary(s2, "Cloud Resources") {
        System_Ext(system_a, "Azure AI Vision", "The AI image analysis service.")
        System_Ext(system_b, "OpenAI", "The AI image generator service.")
    }

    BiRel(user_a, spa, "Uses")
    Rel(spa, img_analyzer, "")
    Rel(spa, img_generator, "")
    Rel(img_analyzer, system_a, "Describes image")
    Rel(img_generator, system_b, "Generates image")    

    UpdateElementStyle(spa, $fontColor="white", $bgColor="#0047ab", $borderColor="black")
    UpdateRelStyle(spa, img_analyzer, $lineColor="#708090")
    UpdateRelStyle(spa, img_analyzer, $lineColor="#708090")
    UpdateRelStyle(user_a, spa, $textColor="blue", $lineColor="blue", $offsetX="5", $offsetY="-10")
    UpdateRelStyle(img_analyzer, system_a, $textColor="blue", $lineColor="blue", $offsetY="-30", $offsetX="20")
    UpdateRelStyle(img_generator, system_b, $textColor="blue", $lineColor="blue", $offsetY="-10", $offsetX="-10")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

---
layout: section
---

# Implementation

---

## Image Analysis Module

<<< @/snippets/azure-image-analysis.js js {none|1-2|4-5|7-10|12-14|16-22|all}
<arrow v-click="[5, 6]" x1="500" y1="300" x2="620" y2="360" color="#953" width="2" arrowSize="1" />

---

## Image Generation Module

<<< @/snippets/openai-image-generation.js#presentation js {none|1|3-5|7-21|all}

---
layout: end
hideInToc: true
---

## <CheckeredFlag/> THE END <CheckeredFlag/>

**In Summary:**
This unit has explored the benefits of combining external distributed services to deliver a new functionality. It has showcased the power of AI in handling vision and imaging tasks. Key implementation details were revealed that have illuminated two ways to communicate with remote systems: using a generic HTTPS protocol and relying on client SDK. Finally, some aspects of visualizing a software architecture were also discussed. 

**Thank You:**
If you find this project useful, please consider giving it a star on GitHub! Just visit [AI Imager](https://github.com/evarga/ai-imager) and click on the ⭐ button in the top-right corner to show your support. Your stars make a big difference!
