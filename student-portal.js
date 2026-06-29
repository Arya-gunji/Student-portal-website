/**
 * EduSphere Student Portal
 * JavaScript + jQuery - Full Website Logic
 */

$(document).ready(function () {

    // ============================================
    // INITIALIZE AOS (Scroll Animations)
    // ============================================
    AOS.init({
        duration: 800,
        once: true,
        offset: 80
    });

    // ============================================
    // PRELOADER - Page load ayyaka hide
    // ============================================
    $(window).on('load', function () {
        setTimeout(function () {
            $('#preloader').addClass('hidden');
        }, 800);
    });

    // ============================================
    // NAVBAR - Scroll effect
    // ============================================
    var $navbar = $('#navbar');

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) {
            $navbar.addClass('scrolled');
        } else {
            $navbar.removeClass('scrolled');
        }

        // Back to top button
        if ($(this).scrollTop() > 400) {
            $('#backToTop').addClass('show');
        } else {
            $('#backToTop').removeClass('show');
        }
    });

    // ============================================
    // MOBILE NAV TOGGLE
    // ============================================
    $('#navToggle').on('click', function () {
        $(this).toggleClass('active');
        $('#navMenu').toggleClass('open');
    });

    // Close menu on link click
    $('.nav-link').on('click', function () {
        $('#navToggle').removeClass('active');
        $('#navMenu').removeClass('open');
    });

    // ============================================
    // SMOOTH SCROLL + Active nav link
    // ============================================
    $('a[href^="#"]').on('click', function (e) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 700, 'swing');
        }
    });

  $(window).on('scroll', function () {
        var scrollPos = $(window).scrollTop() + 100;

        $('section').each(function () {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();
            var id = $(this).attr('id');

            if (scrollPos >= top && scrollPos < bottom) {
                $('.nav-link').removeClass('active');
                $('.nav-link[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // ============================================
    // BACK TO TOP
    // ============================================
    $('#backToTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // ============================================
    // COUNTER ANIMATION (Hero Stats)
    // ============================================
    function animateCounters() {
        $('.counter').each(function () {
            var $this = $(this);
            var target = parseInt($this.data('target'));
            var duration = 2000;
            var step = target / (duration / 16);
            var current = 0;

            var timer = setInterval(function () {
                current += step;
                if (current >= target) {
                    $this.text(target + ($this.data('target') === 98 ? '%' : '+'));
                    clearInterval(timer);
                } else {
                    $this.text(Math.floor(current));
                }
            }, 16);
        });
    }

    // Run counters when hero is visible
    var countersDone = false;
    $(window).on('scroll', function () {
        if (!countersDone && $(window).scrollTop() < 500) {
            countersDone = true;
            animateCounters();
        }
    });

    // Also run on load if hero visible
    setTimeout(animateCounters, 1000);

    // ============================================
    // FORM VALIDATION
    // ============================================
    var $form = $('#studentForm');
    var requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'dob',
        'gender', 'course', 'department', 'year',
        'address', 'city', 'state', 'pincode',
        'password', 'confirmPassword'
    ];

    // Progress bar update
    function updateProgress() {
        var filled = 0;
        var total = requiredFields.length + 1;

        requiredFields.forEach(function (id) {
            var val = $('#' + id).val();
            if (val && val.trim() !== '') filled++;
        });

        if ($('#terms').is(':checked')) filled++;

        var pct = Math.round((filled / total) * 100);
        $('#progressBar').css('width', pct + '%');
        $('#progressText').text(pct + '% Complete');
    }

    // Validation helpers
    function validateName(val, name) {
        if (!val.trim()) return name + ' is required';
        if (!/^[a-zA-Z\s]+$/.test(val)) return 'Only letters allowed';
        return '';
    }

    function validateEmail(email) {
        if (!email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
        return '';
    }

    function validatePhone(phone) {
        if (!phone.trim()) return 'Phone is required';
        if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter valid 10-digit mobile number';
        return '';
    }

    function validateDOB(dob) {
        if (!dob) return 'Date of birth is required';
        var age = new Date().getFullYear() - new Date(dob).getFullYear();
        if (age < 16 || age > 60) return 'Age must be 16-60 years';
        return '';
    }

    function validatePincode(pin) {
        if (!pin.trim()) return 'PIN code is required';
        if (!/^\d{6}$/.test(pin)) return 'PIN must be 6 digits';
        return '';
    }

    function showError(id, msg) {
        $('#' + id).addClass('error').removeClass('success');
        $('#' + id + 'Error').text(msg);
    }

    function clearError(id) {
        $('#' + id).removeClass('error').addClass('success');
        $('#' + id + 'Error').text('');
    }

    function validateField(id) {
        var val = $('#' + id).val();
        var err = '';

        switch (id) {
            case 'firstName': err = validateName(val, 'First name'); break;
            case 'lastName': err = validateName(val, 'Last name'); break;
            case 'email': err = validateEmail(val); break;
            case 'phone': err = validatePhone(val); break;
            case 'dob': err = validateDOB(val); break;
            case 'gender': err = !val ? 'Select gender' : ''; break;
            case 'course': err = !val ? 'Select course' : ''; break;
            case 'department': err = !val ? 'Select department' : ''; break;
            case 'year': err = !val ? 'Select year' : ''; break;
            case 'address': err = !val.trim() ? 'Address is required' : ''; break;
            case 'city': err = !val.trim() ? 'City is required' : ''; break;
            case 'state': err = !val.trim() ? 'State is required' : ''; break;
            case 'pincode': err = validatePincode(val); break;
            case 'password':
                err = !val ? 'Password required' : (val.length < 6 ? 'Min 6 characters' : '');
                break;
            case 'confirmPassword':
                err = !val ? 'Confirm password' : (val !== $('#password').val() ? 'Passwords do not match' : '');
                break;
        }

        if (err) { showError(id, err); return false; }
        clearError(id);
        return true;
    }

    function validateForm() {
        var ok = true;
        requiredFields.forEach(function (id) {
            if (!validateField(id)) ok = false;
        });
        if (!$('#terms').is(':checked')) {
            $('#termsError').text('Agree to terms');
            ok = false;
        } else {
            $('#termsError').text('');
        }
        return ok;
    }

    // Real-time validation
    requiredFields.forEach(function (id) {
        $('#' + id).on('input change', function () {
            validateField(id);
            updateProgress();
        });
    });

    $('#terms').on('change', function () {
        if ($(this).is(':checked')) $('#termsError').text('');
        updateProgress();
    });

    // Password toggle
    $('#togglePwd').on('click', function () {
        var $pwd = $('#password');
        var $icon = $(this).find('i');
        if ($pwd.attr('type') === 'password') {
            $pwd.attr('type', 'text');
            $icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            $pwd.attr('type', 'password');
            $icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Only numbers for phone & pincode
    $('#phone, #pincode').on('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });

    // ============================================
    // FORM SUBMIT
    // ============================================
    $form.on('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            $('.form-card').addClass('shake');
            setTimeout(function () { $('.form-card').removeClass('shake'); }, 500);
            $('.error').first().focus();
            return;
        }

        var data = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            course: $('#course option:selected').text(),
            department: $('#department option:selected').text(),
            year: $('#year option:selected').text(),
            city: $('#city').val(),
            state: $('#state').val()
        };

        var $btn = $('#submitBtn');
        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Submitting...');

        setTimeout(function () {
            showModal(data);
            $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Register Now');
        }, 1500);
    });

    // Show success modal
    function showModal(data) {
        $('#modalName').text(data.firstName + ' ' + data.lastName);

        var html = '';
        html += '<p><strong>Email:</strong> ' + data.email + '</p>';
        html += '<p><strong>Phone:</strong> ' + data.phone + '</p>';
        html += '<p><strong>Course:</strong> ' + data.course + '</p>';
        html += '<p><strong>Department:</strong> ' + data.department + '</p>';
        html += '<p><strong>Year:</strong> ' + data.year + '</p>';
        html += '<p><strong>Location:</strong> ' + data.city + ', ' + data.state + '</p>';

        $('#modalDetails').html(html);
        $('#successModal').addClass('show');
        $('body').css('overflow', 'hidden');
    }

    // Close modal
    $('#modalCloseBtn, .modal-overlay').on('click', function () {
        $('#successModal').removeClass('show');
        $('body').css('overflow', '');
        $form[0].reset();
        $('input, select, textarea').removeClass('error success');
        $('.error-msg').text('');
        updateProgress();
    });

    // Reset form
    $('#resetBtn').on('click', function () {
        if (confirm('Reset the entire form?')) {
            $form[0].reset();
            $('input, select, textarea').removeClass('error success');
            $('.error-msg').text('');
            updateProgress();
        }
    });

    // Initial progress
    updateProgress();

    // ============================================
    // COURSE CARD CLICK - Auto fill course
    // ============================================
    $('.course-card').on('click', function () {
        var title = $(this).find('h3').text().toLowerCase();
        var courseMap = {
            'b.tech computer science': 'btech',
            'bca': 'bca',
            'mba': 'mba'
        };

        Object.keys(courseMap).forEach(function (key) {
            if (title.includes(key.split(' ')[0]) || title === key) {
                $('#course').val(courseMap[key]).trigger('change');
            }
        });

        if (title.includes('b.tech') || title.includes('computer')) {
            $('#course').val('btech').trigger('change');
            $('#department').val('cs').trigger('change');
        } else if (title.includes('bca')) {
            $('#course').val('bca').trigger('change');
            $('#department').val('it').trigger('change');
        } else if (title.includes('mba')) {
            $('#course').val('mba').trigger('change');
            $('#department').val('mba').trigger('change');
        }

        $('html, body').animate({ scrollTop: $('#register').offset().top - 70 }, 700);
    });

    $('.course-card').css('cursor', 'pointer');

});
