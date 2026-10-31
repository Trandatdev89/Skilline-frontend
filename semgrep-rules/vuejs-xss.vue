<!-- Test case cho vuejs-xss.yaml - chay bang: semgrep --test semgrep-rules/ -->
<template>
  <div class="review-list">
    <!-- KB1 - lab goc: render comment bang v-html -->
    <!-- ruleid: vuejs-stored-xss-vhtml-unsanitized -->
    <div class="review-item__comment" v-html="review.comment"></div>

    <!-- KB3 - bien computed tu course.description -->
    <!-- ruleid: vuejs-stored-xss-vhtml-unsanitized -->
    <div class="description-text" v-html="formattedDescription"></div>

    <!-- ruleid: vuejs-stored-xss-vhtml-unsanitized -->
    <div :innerHTML="lecture.title"></div>

    <!-- KB2 - da va: noi suy tu dong escape -->
    <!-- ok: vuejs-stored-xss-vhtml-unsanitized -->
    <div class="review-item__comment">{{ review.comment }}</div>

    <!-- KB2 - da va: sanitize truoc khi bind -->
    <!-- ok: vuejs-stored-xss-vhtml-unsanitized -->
    <div v-html="DOMPurify.sanitize(course.description)"></div>

    <!-- chuoi hang do lap trinh vien viet -->
    <!-- ok: vuejs-stored-xss-vhtml-unsanitized -->
    <span v-html="'<b>Moi</b>'"></span>
  </div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'

function render(el: HTMLElement, html: string) {
  // ruleid: vuejs-dom-xss-innerhtml-assignment
  el.innerHTML = html
  // ok: vuejs-dom-xss-innerhtml-assignment
  el.innerHTML = DOMPurify.sanitize(html)
  // ok: vuejs-dom-xss-innerhtml-assignment
  el.innerHTML = ''
  // ok: vuejs-dom-xss-innerhtml-assignment
  el.textContent = html
  // ruleid: vuejs-dom-xss-innerhtml-assignment
  el.insertAdjacentHTML('beforeend', html)
}
</script>
