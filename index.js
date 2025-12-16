    // Consolidated site JS: form validation + lightbox (images & videos)

    document.addEventListener('DOMContentLoaded', function () {
      // --- Form validation (application form) ---
      function initFormValidation() {
        const form = document.querySelector('form');
        if (!form) return;

        // Helper: ensure inline error element exists and return it
        function getErrorEl(id, afterEl) {
          let el = document.getElementById(id);
          if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.className = 'form-error';
            el.style.color = 'red';
            el.style.fontSize = '0.875rem';
            el.style.marginTop = '4px';
            el.style.marginBottom = '10px';
            afterEl.parentNode.insertBefore(el, afterEl.nextSibling);
          }
          return el;
        }

        const fname = form.querySelector('#fname');
        const email = form.querySelector('#email');
        const prn = form.querySelector('#prn');
        const campus = form.querySelector('#campus');
        const year = form.querySelector('#year');
        const branch = form.querySelector('#branch');
        const checkboxes = form.querySelectorAll('input[name="applying_as"]');
        const videoFile = form.querySelector('#videoFile');
        const applyingLabel = Array.from(form.querySelectorAll('label')).find(l => l.textContent.includes('Applying as'));

        const fnameErr = fname && getErrorEl('fnameError', fname);
        const emailErr = email && getErrorEl('emailError', email);
        const prnErr = prn && getErrorEl('prnError', prn);
        const campusErr = campus && getErrorEl('campusError', campus);
        const yearErr = year && getErrorEl('yearError', year);
        const branchErr = branch && getErrorEl('branchError', branch);
        const applyingErr = checkboxes.length && getErrorEl('applying-error', applyingLabel || checkboxes[0]);
        const videoErr = videoFile && getErrorEl('videoError', videoFile);

        function clearErrors() {
          [fnameErr, emailErr, prnErr, campusErr, yearErr, branchErr, applyingErr, videoErr].forEach(e => { if (e) e.textContent = ''; });
        }

        // small helpers
        function validateEmailAddress(value) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(value.trim());
        }

        function isVideoFileType(file) {
          return file && file.type && file.type.startsWith('video/');
        }

        function validate() {
          clearErrors();
          let valid = true;
          // Full name
          if (!fname || !fname.value.trim()) {
            if (fnameErr) fnameErr.textContent = 'Full name is required';
            valid = false;
          }
          // Email
          if (!email || !email.value.trim()) {
            if (emailErr) emailErr.textContent = 'Email is required';
            valid = false;
            } else {
            if (!validateEmailAddress(email.value)) {
              if (emailErr) emailErr.textContent = 'Enter a valid email address';
              valid = false;
            }
          }
          // PRN
          if (!prn || !prn.value.trim()) {
            if (prnErr) prnErr.textContent = 'PRN is required';
            valid = false;
          }
          // Campus
          if (campus && (!campus.value || campus.value === 'Select Campus')) {
            if (campusErr) campusErr.textContent = 'Please select a campus';
            valid = false;
          }
          // Year
          if (year && (!year.value || year.value === 'Select Year')) {
            if (yearErr) yearErr.textContent = 'Please select a year';
            valid = false;
          }
          // Branch
          if (branch && !branch.value.trim()) {
            if (branchErr) branchErr.textContent = 'Branch is required';
            valid = false;
          }
          // Applying as (checkboxes)
          if (checkboxes && checkboxes.length) {
            const any = Array.from(checkboxes).some(cb => cb.checked);
            if (!any) {
              if (applyingErr) applyingErr.textContent = 'Select an option';
              valid = false;
            }
          }
          // Video file
          if (videoFile) {
            const files = videoFile.files;
            if (!files || files.length === 0) {
              if (videoErr) videoErr.textContent = 'Please upload a video file';
              valid = false;
            } else {
              const file = files[0];
              if (!isVideoFileType(file)) {
                if (videoErr) videoErr.textContent = 'Uploaded file must be a video';
                valid = false;
              } else if (file.size > 50 * 1024 * 1024) {
                if (videoErr) videoErr.textContent = 'Video file must be smaller than 50MB';
                valid = false;
              }
            }
          }

          return valid;
        }



        form.addEventListener('submit', function (e) {
          if (!validate()) {
            e.preventDefault();
            // focus first error field
            const first = [fnameErr, emailErr, prnErr, campusErr, yearErr, branchErr, applyingErr, videoErr].find(x => x && x.textContent);
            if (first) {
              let ref = null;
              if (first.id === 'applying-error') {
                // focus first radio in the group
                ref = form.querySelector('input[name="applying_as"]');
              } else {
                ref = document.getElementById(first.id.replace(/Error$|\-error$/, '')) || first.previousElementSibling || first;
              }
              if (ref && typeof ref.focus === 'function') ref.focus();
            }
          } else {
              e.preventDefault();
              // When form is valid, show an accessible client-side success message and reset the form.
              const successEl = document.getElementById('formSuccess');
              if (successEl) {
                successEl.textContent = 'Application submitted. Thank you! We will get back to you soon.';
                successEl.setAttribute('aria-hidden', 'false');
                successEl.focus();
                setTimeout(() => { successEl.setAttribute('aria-hidden', 'true'); }, 8000);
              } else {
                // Fallback if markup not present
                alert('Application submitted');
              }
              form.reset();
              clearErrors();
          }
        });
      }
      // Initialize form validation
      initFormValidation();

      // --- Site utilities ---
      // Hero CTA: ensure Apply Now always links to the public form
      function configureHeroCTA() {
        const apply = document.getElementById('cta-apply');
        if (!apply) return;
        apply.href = 'form.html';
      }
      configureHeroCTA();

      // --- Lightbox (images & videos) ---
      (function initLightbox() {
        const galleries = document.querySelectorAll('.gallery');
        const lightbox = document.getElementById('lightbox');
        const lbImg = lightbox && lightbox.querySelector('#lightbox-img');
        const lbVideo = lightbox && lightbox.querySelector('#lightbox-video');
        const lbVideoSrc = lightbox && lightbox.querySelector('#lightbox-video-src');
        const lbCaption = lightbox && lightbox.querySelector('#lightbox-caption');
        const closeBtn = lightbox && lightbox.querySelector('.lightbox-close');

        if (!galleries.length || !lightbox || !closeBtn) return;

        let lastFocused = null;
        let lbKeyHandler = null;

        function openImage(img) {
          if (!lbImg) return;
          lbImg.style.display = '';
          if (lbVideo) lbVideo.style.display = 'none';
          const full = img.dataset.full || img.src;
          lbImg.src = full;
          lbImg.alt = img.alt || '';
          if (lbCaption) lbCaption.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
          lastFocused = document.activeElement;
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
          // accessibility attributes are defined in markup
          closeBtn.focus();
          // trap Tab within lightbox
          lbKeyHandler = function (e) {
            if (e.key === 'Tab') {
              const focusables = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
              const nodes = Array.from(focusables).filter(n => !n.hasAttribute('disabled'));
              if (!nodes.length) {
                e.preventDefault();
                closeBtn.focus();
                return;
              }
              const idx = nodes.indexOf(document.activeElement);
              if (e.shiftKey) {
                if (idx <= 0) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
              } else {
                if (idx === nodes.length - 1) { e.preventDefault(); nodes[0].focus(); }
              }
            }
            if (e.key === 'Escape') closeLightbox();
          };
          document.addEventListener('keydown', lbKeyHandler);
        }

        function openVideo(videoEl) {
          if (!lbVideo || !lbVideoSrc) return;
          lbVideo.style.display = '';
          if (lbImg) lbImg.style.display = 'none';
          const src = videoEl.querySelector('source')?.src || videoEl.src || '';
          lbVideoSrc.src = src;
          lbVideo.load();
          lbVideo.play().catch(() => {});
          if (lbCaption) lbCaption.textContent = videoEl.closest('figure')?.querySelector('figcaption')?.textContent || '';
          lastFocused = document.activeElement;
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
          closeBtn.focus();
        }

        function closeLightbox() {
          lightbox.classList.remove('open');
          lightbox.setAttribute('aria-hidden', 'true');
          if (lbImg) {
            lbImg.src = '';
            lbImg.alt = '';
            lbImg.style.display = 'none';
          }
          if (lbVideo) {
            try { lbVideo.pause(); } catch (e) {}
            try { lbVideo.currentTime = 0; } catch (e) {}
            lbVideo.style.display = 'none';
            if (lbVideoSrc) lbVideoSrc.src = '';
          }
          if (lbCaption) lbCaption.textContent = '';
          if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
          lastFocused = null;
          if (lbKeyHandler) {
            document.removeEventListener('keydown', lbKeyHandler);
            lbKeyHandler = null;
          }
        }

        // Attach handlers
        galleries.forEach(gallery => {
          gallery.addEventListener('click', (e) => {
            const img = e.target.closest('img');
            const video = e.target.closest('video');
            if (img) { openImage(img); }
            else if (video) { openVideo(video); }
          });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
      })();

    });

