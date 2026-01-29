<template>

  <section class="company">
    <div class="container">
      <div class="company__title">
        Trusted by 5,000+ Companies Worldwide
      </div>
      <div class="company__combine">
        <div class="company__img">
          <img :srcset="facebook" alt="">
        </div>
        <div class="company__img">
          <img :srcset="google" alt="">
        </div>
        <div class="company__img">
          <img :srcset="netflix" alt="">
        </div>
        <div class="company__img">
          <img :srcset="amazon" alt="">
        </div>
        <div class="company__img">
          <img :srcset="grab" alt="">
        </div>
        <div class="company__img">
          <img :srcset="airhub" alt="">
        </div>
      </div>
    </div>
  </section>

  <section class="introduce">
    <div class="container">
      <div class="global">
        <div class="global__heading">
          All-In-One <span>Cloud Software.</span>
        </div>
        <div class="global__desc">
          Skilline is one powerful online software suite that combines all the tools needed to run a successful school
          or office.
        </div>
      </div>
      <div class="introduce__wrap">
        <div class="introduce__box">
          <div class="introduce__icon introduce__icon--purple">
            <i class="fa-solid fa-file"></i>
          </div>
          <div class="introduce__title">
            Online Billing, Invoicing, & Contracts
          </div>
          <div class="introduce__desc">
            Simple and secure control of your organization’s financial and legal transactions. Send customized invoices
            and contracts
          </div>
        </div>
        <div class="introduce__box">
          <div class="introduce__icon introduce__icon--yellow">

            <i class="fa-solid fa-calendar-days"></i>
          </div>
          <div class="introduce__title">
            Online Billing, Invoicing, & Contracts
          </div>
          <div class="introduce__desc">
            Simple and secure control of your organization’s financial and legal transactions. Send customized invoices
            and contracts
          </div>
        </div>
        <div class="introduce__box">
          <div class="introduce__icon introduce__icon--blue">

            <i class="fa-solid fa-people-group"></i>
          </div>
          <div class="introduce__title">
            Online Billing, Invoicing, & Contracts
          </div>
          <div class="introduce__desc">
            Simple and secure control of your organization’s financial and legal transactions. Send customized invoices
            and contracts
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="question">
    <div class="container">
      <div class="global">
        <div class="global__heading">
          What is
          <span>Skilline?</span>
        </div>
        <div class="global__desc">
          Skilline is a platform that allows educators to create online classes whereby they can store the course
          materials online; manage assignments, quizzes and exams; monitor due dates; grade results and provide students
          with feedback all in one place.
        </div>
      </div>
      <div class="question__wrap">
        <div class="question__box">
          <div class="question__img">
            <img :srcset="questionone" alt="question..">
          </div>
          <div class="question__content">
            <div class="question__title">
              FOR INSTRUCTORS
            </div>
            <a href="" class="btn btn--primary question__btn ">Start a class today</a>
          </div>
        </div>
        <div class="question__box">
          <div class="question__img">
            <img :srcset="group" alt="question..">
          </div>
          <div class="question__content">
            <div class="question__title">
              FOR INSTRUCTORS
            </div>
            <a href="" class="btn btn--primary question__btn ">Start a class today</a>
          </div>
        </div>
      </div>
      <div class="question__learn">
        <div class="question__theme">
          <div class="global__heading question__subtitle">
            Everything you can do in a physical classroom, <span>you can do with Skilline</span>
          </div>
          <div class="global__desc">
            Skilline’s school management software helps traditional and online schools manage scheduling, attendance,
            payments and virtual classrooms all in one secure cloud-based system.
          </div>
        </div>
        <div class="question__subimg">
          <img :srcset="room" alt="room">
        </div>
      </div>
    </div>
  </section>

  <section class="feature">
    <div class="container">
      <div class="global">
        <div class="global__heading">
          Our Features
        </div>
        <div class="global__desc">
          This very extraordinary feature, can make learning activities more efficient
        </div>
      </div>
      <div class="feature__wrap">
        <div class="feature__main">
          <div class="feature__content">
            <div class="subglobal">
              <div class="subglobal__heading">
                A <span>user interface</span> designed for the classroom
              </div>
              <div class="subglobal__desc">
                Teachers don’t get lost in the grid view and have a dedicated Podium space.
              </div>
              <div class="subglobal__desc">
                TA’s and presenters can be moved to the front of the class.
              </div>
              <div class="subglobal__desc">
                Teachers can easily see all students and class data at one time.
              </div>
            </div>
          </div>
          <div class="feature__img">
            <img :srcset="chat" alt="chat">
          </div>
        </div>
        <div class="feature__main">
          <div class="feature__content">
            <div class="subglobal">
              <div class="subglobal__heading">
                <span>Tools</span> For Teachers And Learners
              </div>
              <div class="subglobal__desc">
                Class has a dynamic set of teaching tools built to be deployed and used during class.
                Teachers can handout assignments in real-time for students to complete and submit.
              </div>
            </div>
          </div>
          <div class="feature__img">
            <img :srcset="learn" alt="chat">
          </div>
        </div>
        <div class="feature__main">
          <div class="feature__content">
            <div class="subglobal">
              <div class="subglobal__heading">
                Assessments, <span>Quizzes</span>, Tests
              </div>
              <div class="subglobal__desc">
                Easily launch live assignments, quizzes, and tests.
                Student results are automatically entered in the online gradebook.
              </div>

            </div>
          </div>
          <div class="feature__img">
            <img :srcset="quizz" alt="chat">
          </div>
        </div>
        <div class="feature__main">
          <div class="feature__content">
            <div class="subglobal">
              <div class="subglobal__heading">
                <span>Class Management</span> Tools for Educators
              </div>
              <div class="subglobal__desc">
                Class provides tools to help run and manage the class such as Class Roster, Attendance, and more. With
                the
                Gradebook, teachers can review and grade tests and quizzes in real-time.
              </div>

            </div>
          </div>
          <div class="feature__img">
            <img :srcset="book" alt="chat">
          </div>
        </div>
        <div class="feature__main">
          <div class="feature__content">
            <div class="subglobal">
              <div class="subglobal__heading">
                One-on-One <span>Discussions</span></div>
              <div class="subglobal__desc">
                Teachers and teacher assistants can talk with students privately without leaving the Zoom environment.
              </div>

            </div>
          </div>
          <div class="feature__img">
            <img :srcset="one" alt="chat">
          </div>
        </div>
      </div>

    </div>
  </section>

  <section class="blog">
    <div class="container">
      <div class="global">
        <div class="global__heading">
          Lastest News and Resources
        </div>
        <div class="global__desc">
          See the developments that have occurred to Skillines in the world
        </div>
      </div>
      <div class="blog__wrap">
        <div class="blog__boxparent blog__boxparent--left">
          <div class="blog__img">
            <img :srcset="blog" alt="blog">
          </div>
          <span>NEWS</span>
          <div class="blog__content">
            <div class="blog__title">
              Class adds $30 million to its balance sheet for a Zoom-friendly edtech solution
            </div>
            <div class="blog__desc">
              Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...
            </div>
          </div>
          <a href="/">Read more...</a>
        </div>
        <div class="blog__boxparent blog__boxparent--right">
          <div class="blog__box">
            <div class="blog__imgbox">
              <img :srcset="blog" alt="blog">
              <span class="blog__bitton">NEWS</span>
            </div>
            <div class="blog__content">
              <div class="blog__title">
                Class Technologies Inc. Closes $30 Million Series A Financing to Meet High Demand
              </div>
              <div class="blog__desc">
                Class Technologies Inc., the company that created Class,...
              </div>
            </div>
          </div>
          <div class="blog__box">
            <div class="blog__imgbox">
              <img :srcset="blog" alt="blog">
              <span class="blog__bitton">NEWS</span>
            </div>
            <div class="blog__content">
              <div class="blog__title">
                Class Technologies Inc. Closes $30 Million Series A Financing to Meet High Demand
              </div>
              <div class="blog__desc">
                Class Technologies Inc., the company that created Class,...
              </div>
            </div>
          </div>
          <div class="blog__box">
            <div class="blog__imgbox">
              <img :srcset="blog" alt="blog">
              <span class="blog__bitton">NEWS</span>
            </div>
            <div class="blog__content">
              <div class="blog__title">
                Class Technologies Inc. Closes $30 Million Series A Financing to Meet High Demand
              </div>
              <div class="blog__desc">
                Class Technologies Inc., the company that created Class,...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


</template>

<script setup lang="ts">
  import facebook from '../assets/img/facebook.svg'
  import google from '../assets/img/google.svg'
  import netflix from '../assets/img/netflix.svg'
  import amazon from '../assets/img/amazon.svg'
  import grab from '../assets/img/grab.svg'
  import airhub from '../assets/img/airbnb.svg'
  import questionone from '../assets/img/img1.png'
  import group from '../assets/img/img2.png'
  import room from '../assets/img/img3.png'
  import chat from '../assets/img/img4.png'
  import learn from '../assets/img/img5.png'
  import quizz from '../assets/img/img6.png'
  import book from '../assets/img/img7.png'
  import blog from '../assets/img/Group 40.png'
  import one from '../assets/img/img8.png'


</script>
