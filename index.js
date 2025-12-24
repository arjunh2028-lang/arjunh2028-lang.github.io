    

    document.addEventListener('DOMContentLoaded', function () {
      
      function initFormValidation() {
        const form = document.querySelector('form');
        if (!form) return;

        
        function getErrorEl(id, afterEl) {
          let el = document.getElementById(id);
          if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.className = 'form-error';
            el.setAttribute('aria-hidden', 'true');
            el.setAttribute('role', 'alert');
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
          [fnameErr, emailErr, prnErr, campusErr, yearErr, branchErr, applyingErr, videoErr].forEach(e => { if (e) { e.textContent = ''; e.setAttribute('aria-hidden', 'true'); } });
          // remove aria-invalid
          [fname, email, prn, campus, year, branch, videoFile].forEach(i => { if (i && typeof i.removeAttribute === 'function') i.removeAttribute('aria-invalid'); });
          // uncheck radios' aria-invalid
          checkboxes.forEach(cb => { if (cb && typeof cb.removeAttribute === 'function') cb.removeAttribute('aria-invalid'); });
        }

        
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
          
          if (!fname || !fname.value.trim()) {
            if (fnameErr) { fnameErr.textContent = 'Full name is required'; fnameErr.setAttribute('aria-hidden','false'); }
            if (fname && typeof fname.setAttribute === 'function') fname.setAttribute('aria-invalid','true');
            valid = false;
          }
          
          if (!email || !email.value.trim()) {
            if (emailErr) { emailErr.textContent = 'Email is required'; emailErr.setAttribute('aria-hidden','false'); }
            if (email && typeof email.setAttribute === 'function') email.setAttribute('aria-invalid','true');
            valid = false;
            } else {
            if (!validateEmailAddress(email.value)) {
              if (emailErr) { emailErr.textContent = 'Enter a valid email address'; emailErr.setAttribute('aria-hidden','false'); }
              if (email && typeof email.setAttribute === 'function') email.setAttribute('aria-invalid','true');
              valid = false;
            }
          }
          
          if (!prn || !prn.value.trim()) {
            if (prnErr) { prnErr.textContent = 'PRN is required'; prnErr.setAttribute('aria-hidden','false'); }
            if (prn && typeof prn.setAttribute === 'function') prn.setAttribute('aria-invalid','true');
            valid = false;
          }
          
          if (campus && (!campus.value || campus.value === 'Select Campus')) {
            if (campusErr) { campusErr.textContent = 'Please select a campus'; campusErr.setAttribute('aria-hidden','false'); }
            if (campus && typeof campus.setAttribute === 'function') campus.setAttribute('aria-invalid','true');
            valid = false;
          }
          
          if (year && (!year.value || year.value === 'Select Year')) {
            if (yearErr) { yearErr.textContent = 'Please select a year'; yearErr.setAttribute('aria-hidden','false'); }
            if (year && typeof year.setAttribute === 'function') year.setAttribute('aria-invalid','true');
            valid = false;
          }
          
          if (branch && !branch.value.trim()) {
            if (branchErr) { branchErr.textContent = 'Branch is required'; branchErr.setAttribute('aria-hidden','false'); }
            if (branch && typeof branch.setAttribute === 'function') branch.setAttribute('aria-invalid','true');
            valid = false;
          }
          
          if (checkboxes && checkboxes.length) {
            const any = Array.from(checkboxes).some(cb => cb.checked);
            if (!any) {
              if (applyingErr) { applyingErr.textContent = 'Select an option'; applyingErr.setAttribute('aria-hidden','false'); }
              checkboxes.forEach(cb => { if (cb && typeof cb.setAttribute === 'function') cb.setAttribute('aria-invalid','true'); });
              valid = false;
            }
          }
          
          if (videoFile) {
            const files = videoFile.files;
            if (!files || files.length === 0) {
              if (videoErr) { videoErr.textContent = 'Please upload a video file'; videoErr.setAttribute('aria-hidden','false'); }
              if (videoFile && typeof videoFile.setAttribute === 'function') videoFile.setAttribute('aria-invalid','true');
              valid = false;
            } else {
              const file = files[0];
              if (!isVideoFileType(file)) {
                if (videoErr) { videoErr.textContent = 'Uploaded file must be a video'; videoErr.setAttribute('aria-hidden','false'); }
                if (videoFile && typeof videoFile.setAttribute === 'function') videoFile.setAttribute('aria-invalid','true');
                valid = false;
              } else if (file.size > 50 * 1024 * 1024) {
                if (videoErr) { videoErr.textContent = 'Video file must be smaller than 50MB'; videoErr.setAttribute('aria-hidden','false'); }
                if (videoFile && typeof videoFile.setAttribute === 'function') videoFile.setAttribute('aria-invalid','true');
                valid = false;
              }
            }
          }

          return valid;
        }



        form.addEventListener('submit', function (e) {
          if (!validate()) {
            e.preventDefault();
           
            const first = [fnameErr, emailErr, prnErr, campusErr, yearErr, branchErr, applyingErr, videoErr].find(x => x && x.textContent);
            if (first) {
              let ref = null;
              if (first.id === 'applying-error') {
                
                ref = form.querySelector('input[name="applying_as"]');
              } else {
                ref = document.getElementById(first.id.replace(/Error$|\-error$/, '')) || first.previousElementSibling || first;
              }
              if (ref && typeof ref.focus === 'function') ref.focus();
            }
          } else {
              e.preventDefault();
              
              const successEl = document.getElementById('formSuccess');
              if (successEl) {
                successEl.textContent = 'Application submitted. Thank you! We will get back to you soon.';
                successEl.setAttribute('aria-hidden', 'false');
                successEl.focus();
                setTimeout(() => { successEl.setAttribute('aria-hidden', 'true'); }, 8000);
              } else {
                alert('Application submitted');
              }

              // Persist form data to localStorage applicants table
              try {
                const applicant = {
                  id: Date.now(),
                  full_name: fname && fname.value.trim() || '',
                  email: email && email.value.trim() || '',
                  prn: prn && prn.value.trim() || '',
                  campus: campus && campus.value || '',
                  year: year && year.value || '',
                  branch: branch && branch.value.trim() || '',
                  applying_as: Array.from(checkboxes || []).find(cb => cb.checked)?.value || '',
                  videoFileName: (videoFile && videoFile.files && videoFile.files[0] && videoFile.files[0].name) || '',
                  date: new Date().toISOString(),
                  notes: ''
                };
                addApplicant(applicant);
              } catch (e) { /* ignore */ }

              form.reset();
              clearErrors();
          }
        });
      }
      
      initFormValidation();

      
      function configureHeroCTA() {
        const apply = document.getElementById('cta-apply');
        if (!apply) return;
        apply.href = 'form.html';
      }
      configureHeroCTA();

      
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
          
          closeBtn.focus();
          
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

      // Admin controls for Achievements management (jQuery)
      const ADMIN_PASSWORD = 'Aaroh@2025';

      function selectRole(role) {
        const $adminLogin = $('#adminLogin');
        const $adminPanel = $('#adminPanel');
        const $status = $('#adminStatus');
        if (role === 'admin') {
          $adminLogin.show().attr('aria-hidden', 'false');
        } else {
          $adminLogin.hide().attr('aria-hidden', 'true');
          $adminPanel.hide().attr('aria-hidden', 'true');
          $status.text('').css('color', '');
        }
      }
      window.selectRole = selectRole;

      function adminLogin() {
        const $pw = $('#adminPassword');
        const $status = $('#adminStatus');
        if (!$pw.length || !$status.length) return;
        if ($pw.val() === ADMIN_PASSWORD) {
          $status.text('Logged in as Admin').css('color', '#00c8ff');
          $('#adminPanel').show().attr('aria-hidden', 'false');
          $('#adminLogin').hide();
          $pw.val('');
        } else {
          $status.text('Invalid password').css('color', '#f87171');
          $pw.focus();
          setTimeout(() => { $status.text('').css('color', ''); }, 3000);
        }
      }
      window.adminLogin = adminLogin;

      // Cookie helpers and persistent storage for achievements
      const STORAGE_COOKIE = 'aaroh_achievements';

      function setCookie(name, value, days) {
        const expires = days ? '; expires=' + new Date(Date.now() + days * 864e5).toUTCString() : '';
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
      }

      function getCookie(name) {
        const pair = document.cookie.split('; ').find(row => row.startsWith(name + '='));
        return pair ? decodeURIComponent(pair.split('=').slice(1).join('=')) : null;
      }

      function getStoredAchievements() {
        const raw = getCookie(STORAGE_COOKIE);
        if (!raw) return [];
        try { return JSON.parse(raw); } catch (e) { return []; }
      }

      function saveStoredAchievements(arr) {
        try { setCookie(STORAGE_COOKIE, JSON.stringify(arr), 365); } catch (e) { /* ignore */ }
      }

      function renderStoredAchievements() {
        const arr = getStoredAchievements();
        const $section = $('#achievementsSection');
        if (!$section.length) return;
        // Remove previously injected stored items to avoid duplicates
        $section.find('article.stored-achievement').remove();
        if (!arr.length) return;
        // Insert stored achievements (arr assumed newest-first)
        arr.forEach(item => {
          const $article = $('<article>').addClass('stored-achievement').attr('data-id', item.id);
          const $h = $('<h3>').text(item.title || ('Update — ' + new Date(item.date).toLocaleDateString()));
          const $p = $('<p>').text(item.text);
          $article.append($h).append($p);
          const $firstArticle = $section.find('article').first();
          if ($firstArticle.length) { $firstArticle.before($article); }
          else { $section.children('h2, p').last().after($article); }
        });
      }

      // Admin inline validation helpers
      function setAdminError($el, id, msg) {
        let $err = $('#' + id);
        if (!$err.length) {
          $err = $('<div>').attr('id', id).addClass('form-error').attr('role', 'alert');
          $el.after($err);
        }
        $err.text(msg).attr('aria-hidden', 'false');
        $el.attr('aria-invalid', 'true');
      }

      function clearAdminErrors() {
        $('#achTitleError,#achTextError').each(function () { $(this).text('').attr('aria-hidden', 'true'); });
        $('#newAchievement,#newAchievementTitle').removeAttr('aria-invalid');
      }

      function addAchievement() {
        clearAdminErrors();
        const $ta = $('#newAchievement');
        const $title = $('#newAchievementTitle');
        if (!$ta.length || !$title.length) return;
        const text = $ta.val().trim();
        const title = $title.val().trim();

        let invalid = false;
        if (!title) { setAdminError($title, 'achTitleError', 'Title is required'); invalid = true; }
        if (!text) { setAdminError($ta, 'achTextError', 'Achievement text is required'); invalid = true; }
        if (invalid) {
          const $firstErr = $('.form-error').filter(function () { return $(this).text().trim(); }).first();
          if ($firstErr.length) {
            const ref = $firstErr.prevAll('input,textarea').first();
            if (ref.length) ref.focus();
          }
          return;
        }

        const item = { id: Date.now(), text: text, date: new Date().toISOString(), title: title || null };
        const arr = getStoredAchievements();
        arr.unshift(item); // newest first
        saveStoredAchievements(arr);
        renderStoredAchievements();

        $ta.val(''); $title.val('');
        $('#adminStatus').text('Achievement added and saved.').css('color', '#00c8ff');
        setTimeout(() => { $('#adminStatus').text(''); }, 5000);
      }
      window.addAchievement = addAchievement;

      function openMailDraft() {
        clearAdminErrors();
        const text = ($('#newAchievement').val() || '').trim();
        const title = ($('#newAchievementTitle').val() || '').trim();
        let invalid = false;
        if (!title) { setAdminError($('#newAchievementTitle'), 'achTitleError', 'Title is required to create a meaningful subject'); invalid = true; }
        if (!text) { setAdminError($('#newAchievement'), 'achTextError', 'Please enter an achievement to mail'); invalid = true; }
        if (invalid) {
          const $firstErr = $('.form-error').filter(function () { return $(this).text().trim(); }).first();
          if ($firstErr.length) {
            const ref = $firstErr.prevAll('input,textarea').first();
            if (ref.length) ref.focus();
          }
          return;
        }
        const subject = encodeURIComponent(title || 'New Achievement — Aaroh Music Club');
        const body = encodeURIComponent((title ? title + '\n\n' : '') + text + '\n\n— Aaroh Music Club\n' + location.href);
        window.open('mailto:?subject=' + subject + '&body=' + body, '_blank');
        $('#adminStatus').text('Mail draft opened.').css('color', '#00c8ff');
        setTimeout(() => { $('#adminStatus').text(''); }, 5000);
      }
      window.openMailDraft = openMailDraft;

      // Render any stored achievements and applicants, and ensure default view
      renderStoredAchievements();
      renderApplicantsTable();
      bindApplicantsTableEvents();
      selectRole('user');

      // Applicants localStorage helpers
      const APPLICANTS_KEY = 'aaroh_applicants';

      function getApplicants() {
        const raw = localStorage.getItem(APPLICANTS_KEY);
        if (!raw) return [];
        try { return JSON.parse(raw); } catch (e) { return []; }
      }

      function saveApplicants(arr) {
        try { localStorage.setItem(APPLICANTS_KEY, JSON.stringify(arr)); } catch (e) { /* ignore */ }
      }

      function addApplicant(item) {
        const arr = getApplicants();
        arr.unshift(item); // newest first
        saveApplicants(arr);
        renderApplicantsTable();
      }

      function renderApplicantsTable(filter) {
        const arr = getApplicants();
        const tbody = document.getElementById('applicantsBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const filtered = (filter && filter.trim()) ? arr.filter(a => {
          const q = filter.trim().toLowerCase();
          return (a.full_name || '').toLowerCase().includes(q) || (a.email||'').toLowerCase().includes(q) || (a.prn||'').toLowerCase().includes(q) || (a.branch||'').toLowerCase().includes(q) || (a.campus||'').toLowerCase().includes(q) || (a.applying_as||'').toLowerCase().includes(q);
        }) : arr;
        if (!filtered.length) {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td colspan="10" class="muted">No entries yet — use the <a href="form.html">Application Form</a> to add sample data.</td>`;
          tbody.appendChild(tr);
        } else {
          filtered.forEach(item => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', item.id);
            tr.innerHTML = `
              <td>${escapeHtml(item.full_name)}</td>
              <td>${escapeHtml(item.email)}</td>
              <td>${escapeHtml(item.prn)}</td>
              <td>${escapeHtml(item.campus)}</td>
              <td>${escapeHtml(item.year)}</td>
              <td>${escapeHtml(item.branch)}</td>
              <td>${escapeHtml(item.applying_as)}</td>
              <td>${escapeHtml(item.videoFileName || '')}</td>
              <td class="notes">${escapeHtml(item.notes || '')}</td>
              <td class="actions">
                <button class="small-btn btn-edit" data-id="${item.id}">Edit</button>
                <button class="small-btn btn-delete" data-id="${item.id}">Delete</button>
              </td>`;
            tbody.appendChild(tr);
          });
        }
        const count = document.getElementById('appCount'); if (count) count.textContent = (filtered.length || 0);
      }

      function bindApplicantsTableEvents() {
        const tbody = document.getElementById('applicantsBody');
        if (!tbody) return;

        // Search
        const search = document.getElementById('applicantSearch');
        if (search) {
          search.addEventListener('input', () => renderApplicantsTable(search.value));
        }

        // Export
        const exportBtn = document.getElementById('exportCsvBtn');
        if (exportBtn) exportBtn.addEventListener('click', exportApplicantsCSV);

        // Delegated click handler for edit/delete/save/cancel
        tbody.addEventListener('click', function (e) {
          const target = e.target;
          if (target.matches('.btn-delete')) {
            const id = target.getAttribute('data-id');
            if (!confirm('Delete this entry?')) return;
            let arr = getApplicants();
            arr = arr.filter(a => String(a.id) !== String(id));
            saveApplicants(arr);
            renderApplicantsTable();
          }
          if (target.matches('.btn-edit')) {
            const row = target.closest('tr');
            if (!row) return;
            enterRowEditMode(row);
          }
          if (target.matches('.btn-save')) {
            const row = target.closest('tr');
            if (!row) return; saveRowEdit(row);
          }
          if (target.matches('.btn-cancel')) {
            renderApplicantsTable(document.getElementById('applicantSearch')?.value || '');
          }
        });
      }

      function enterRowEditMode(row) {
        const id = row.getAttribute('data-id');
        const arr = getApplicants();
        const item = arr.find(a => String(a.id) === String(id));
        if (!item) return;
        row.innerHTML = `
          <td><input class="edit-input" name="full_name" value="${escapeAttr(item.full_name)}"></td>
          <td><input class="edit-input" name="email" value="${escapeAttr(item.email)}"></td>
          <td><input class="edit-input" name="prn" value="${escapeAttr(item.prn)}"></td>
          <td><input class="edit-input" name="campus" value="${escapeAttr(item.campus)}"></td>
          <td><input class="edit-input" name="year" value="${escapeAttr(item.year)}"></td>
          <td><input class="edit-input" name="branch" value="${escapeAttr(item.branch)}"></td>
          <td><input class="edit-input" name="applying_as" value="${escapeAttr(item.applying_as)}"></td>
          <td>${escapeHtml(item.videoFileName || '')}</td>
          <td><input class="edit-input" name="notes" value="${escapeAttr(item.notes || '')}"></td>
          <td>
            <button class="small-btn btn-save" data-id="${item.id}">Save</button>
            <button class="small-btn btn-cancel">Cancel</button>
          </td>`;
      }

      function saveRowEdit(row) {
        const id = row.getAttribute('data-id');
        const inputs = row.querySelectorAll('.edit-input');
        const data = {};
        inputs.forEach(inp => { data[inp.name] = inp.value.trim(); });
        let arr = getApplicants();
        const idx = arr.findIndex(a => String(a.id) === String(id));
        if (idx === -1) return;
        arr[idx] = Object.assign({}, arr[idx], {
          full_name: data.full_name || arr[idx].full_name,
          email: data.email || arr[idx].email,
          prn: data.prn || arr[idx].prn,
          campus: data.campus || arr[idx].campus,
          year: data.year || arr[idx].year,
          branch: data.branch || arr[idx].branch,
          applying_as: data.applying_as || arr[idx].applying_as,
          notes: data.notes || arr[idx].notes
        });
        saveApplicants(arr);
        renderApplicantsTable(document.getElementById('applicantSearch')?.value || '');
      }

      function exportApplicantsCSV() {
        const arr = getApplicants();
        if (!arr.length) { alert('No data to export'); return; }
        const headers = ['Full name','Email','PRN No.','Campus','Year','Branch','Applying as','Video file','Notes','Date'];
        const lines = [headers.join(',')];
        arr.forEach(a => {
          const row = [a.full_name,a.email,a.prn,a.campus,a.year,a.branch,a.applying_as,(a.videoFileName||''),(a.notes||''),a.date];
          lines.push(row.map(v => '"' + String(v||'').replace(/"/g,'""') + '"').join(','));
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'applicants.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      }

      // simple escaping helpers
      function escapeHtml(s){ if (s==null) return ''; return String(s).replace(/[&<>]/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
      function escapeAttr(s){ if (s==null) return ''; return String(s).replace(/"/g,'&quot;').replace(/&/g,'&amp;'); }

    });




    

