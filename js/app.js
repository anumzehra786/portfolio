$( document ).ready(function() {
     $('.data-one').circliful();
		$('.data-two').circliful();
		$('.data-three').circliful();
    });

(function ($) {

    $.fn.circliful = function (options, callback) {

        var settings = $.extend({
            // These are the defaults.
            startdegree: 0,
            fgcolor: "#556b2f",
            bgcolor: "#eee",
            fill: false,
            width: 15,
            dimension: 200,
            fontsize: 15,
            percent: 50,
            animationstep: 1.0,
            iconsize: '20px',
            iconcolor: '#999',
            border: 'default',
            complete: null,
            bordersize: 10
        }, options);

        return this.each(function () {

            var customSettings = ["fgcolor", "bgcolor", "fill", "width", "dimension", "fontsize", "animationstep", "endPercent", "icon", "iconcolor", "iconsize", "border", "startdegree", "bordersize"];

            var customSettingsObj = {};
            var icon = '';
            var percent;
            var endPercent = 0;
            var obj = $(this);
            var fill = false;
            var text, info;

            obj.addClass('circliful');

            checkDataAttributes(obj);

            if (obj.data('text') != undefined) {
                text = obj.data('text');

                if (obj.data('icon') != undefined) {
                    icon = $('<i></i>')
                        .addClass('fa ' + $(this).data('icon'))
                        .css({
                            'color': customSettingsObj.iconcolor,
                            'font-size': customSettingsObj.iconsize
                        });
                }

                if (obj.data('type') != undefined) {
                    type = $(this).data('type');

                    if (type == 'half') {
                        addCircleText(obj, 'circle-text-half', (customSettingsObj.dimension / 1.45));
                    } else {
                        addCircleText(obj, 'circle-text', customSettingsObj.dimension);
                    }
                } else {
                    addCircleText(obj, 'circle-text', customSettingsObj.dimension);
                }
            }

            if ($(this).data("total") != undefined && $(this).data("part") != undefined) {
                var total = $(this).data("total") / 100;

                percent = (($(this).data("part") / total) / 100).toFixed(3);
                endPercent = ($(this).data("part") / total).toFixed(3);
            } else {
                if ($(this).data("percent") != undefined) {
                    percent = $(this).data("percent") / 100;
                    endPercent = $(this).data("percent");
                } else {
                    percent = settings.percent / 100;
                }
            }

            if ($(this).data('info') != undefined) {
                info = $(this).data('info');

                if ($(this).data('type') != undefined) {
                    type = $(this).data('type');

                    if (type == 'half') {
                        addInfoText(obj, 0.9);
                    } else {
                        addInfoText(obj, 1.25);
                    }
                } else {
                    addInfoText(obj, 1.25);
                }
            }

            $(this).width(customSettingsObj.dimension + 'px');

            var size = customSettingsObj.dimension,
                canvas = $('<canvas></canvas>').attr({
                    width: size,
                    height: size
                }).appendTo($(this)).get(0);

            var context = canvas.getContext('2d');

            var dpr = window.devicePixelRatio;
            if ( dpr ) {
                var $canvas = $(canvas);
                $canvas.css('width', size);
                $canvas.css('height', size);
                $canvas.attr('width', size * dpr);
                $canvas.attr('height', size * dpr);

                context.scale(dpr, dpr);
            }

            var container = $(canvas).parent();
            var x = size / 2;
            var y = size / 2;
            var degrees = customSettingsObj.percent * 360.0;
            var radians = degrees * (Math.PI / 180);
            var radius = size / 2.5;
            var startAngle = 2.3 * Math.PI;
            var endAngle = 0;
            var counterClockwise = false;
            var curPerc = customSettingsObj.animationstep === 0.0 ? endPercent : 0.0;
            var curStep = Math.max(customSettingsObj.animationstep, 0.0);
            var circ = Math.PI * 2;
            var quart = Math.PI / 2;
            var type = '';
            var fireCallback = true;
            var additionalAngelPI = (customSettingsObj.startdegree / 180) * Math.PI;

            if ($(this).data('type') != undefined) {
                type = $(this).data('type');

                if (type == 'half') {
                    startAngle = 2.0 * Math.PI;
                    endAngle = 3.13;
                    circ = Math.PI;
                    quart = Math.PI / 0.996;
                }
            }
            
            if ($(this).data('type') != undefined) {
                type = $(this).data('type');

                if (type == 'angle') {
                    startAngle = 2.25 * Math.PI;
                    endAngle = 2.4;
                    circ = 1.53 + Math.PI;
                    quart = 0.73 + Math.PI / 0.996;
                }
            }

            /**
             * adds text to circle
             *
             * @param obj
             * @param cssClass
             * @param lineHeight
             */
            function addCircleText(obj, cssClass, lineHeight) {
                $("<span></span>")
                    .appendTo(obj)
                    .addClass(cssClass)
                    .html(text)
                    .prepend(icon)
                    .css({
                        'line-height': lineHeight + 'px',
                        'font-size': customSettingsObj.fontsize + 'px'
                    });
            }

            /**
             * adds info text to circle
             *
             * @param obj
             * @param factor
             */
            function addInfoText(obj, factor) {
                $('<span></span>')
                    .appendTo(obj)
                    .addClass('circle-info-half')
                    .css(
                        'line-height', (customSettingsObj.dimension * factor) + 'px'
                    )
                    .text(info);
            }

            /**
             * checks which data attributes are defined
             * @param obj
             */
            function checkDataAttributes(obj) {
                $.each(customSettings, function (index, attribute) {
                    if (obj.data(attribute) != undefined) {
                        customSettingsObj[attribute] = obj.data(attribute);
                    } else {
                        customSettingsObj[attribute] = $(settings).attr(attribute);
                    }

                    if (attribute == 'fill' && obj.data('fill') != undefined) {
                        fill = true;
                    }
                });
            }

            /**
             * animate foreground circle
             * @param current
             */
            function animate(current) {

                context.clearRect(0, 0, canvas.width, canvas.height);

                context.beginPath();
                context.arc(x, y, radius, endAngle, startAngle, false);

                context.lineWidth = customSettingsObj.width + 1;

                context.strokeStyle = customSettingsObj.bgcolor;
                context.stroke();

                if (fill) {
                    context.fillStyle = customSettingsObj.fill;
                    context.fill();
                }

                context.beginPath();
                context.arc(x, y, radius, -(quart) + additionalAngelPI, ((circ) * current) - quart + additionalAngelPI, false);

                if (customSettingsObj.border == 'outline') {
                    context.lineWidth = customSettingsObj.width + 13;
                } else if (customSettingsObj.border == 'inline') {
                    context.lineWidth = customSettingsObj.width - 13;
                }

                context.strokeStyle = customSettingsObj.fgcolor;
                context.stroke();

                if (curPerc < endPercent) {
                    curPerc += curStep;
                    requestAnimationFrame(function () {
                        animate(Math.min(curPerc, endPercent) / 100);
                    }, obj);
                }

                if (curPerc == endPercent && fireCallback && typeof(options) != "undefined") {
                    if ($.isFunction(options.complete)) {
                        options.complete();

                        fireCallback = false;
                    }
                }
            }

            animate(curPerc / 100);

        });
    };
}(jQuery));

 let currentStep = 1;
        const totalSteps = 3;

        // Initialize floating labels and validation
        document.addEventListener('DOMContentLoaded', function() {
            initializeFloatingLabels();
            initializeValidation();
        });

        function initializeFloatingLabels() {
            const inputs = document.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                const wrapper = input.closest('.input-wrapper');
                const label = wrapper?.querySelector('.floating-label');
                
                if (!label) return;

                // Check if input has value on load
                if (input.value.trim() !== '') {
                    label.classList.add('filled');
                }

                // Focus events
                input.addEventListener('focus', function() {
                    label.classList.add('active');
                    wrapper.classList.add('focused');
                });

                input.addEventListener('blur', function() {
                    label.classList.remove('active');
                    wrapper.classList.remove('focused');
                    
                    if (input.value.trim() !== '') {
                        label.classList.add('filled');
                    } else {
                        label.classList.remove('filled');
                    }
                });

                // Input events for real-time updates
                input.addEventListener('input', function() {
                    if (input.value.trim() !== '') {
                        label.classList.add('filled');
                    } else {
                        label.classList.remove('filled');
                    }
                    
                    // Clear validation errors on input
                    clearFieldError(input);
                });
            });
        }

        function initializeValidation() {
            const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(input);
                });
            });
        }

        function validateField(input) {
            const wrapper = input.closest('.input-wrapper');
            const validationIcon = wrapper?.querySelector('.validation-icon');
            const errorMessage = input.parentNode.nextElementSibling;
            
            let isValid = true;
            
            if (!input.value.trim()) {
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                isValid = false;
            }
            
            if (validationIcon) {
                validationIcon.className = 'validation-icon';
                if (isValid) {
                    validationIcon.classList.add('valid');
                    validationIcon.innerHTML = '✓';
                } else {
                    validationIcon.classList.add('invalid');
                    validationIcon.innerHTML = '✕';
                }
            }
            
            return isValid;
        }

        function clearFieldError(input) {
            const wrapper = input.closest('.input-wrapper');
            const validationIcon = wrapper?.querySelector('.validation-icon');
            const errorMessage = input.parentNode.nextElementSibling;
            
            input.classList.remove('error');
            if (errorMessage && errorMessage.classList.contains('error-message')) {
                errorMessage.classList.remove('show');
            }
            
            if (validationIcon) {
                validationIcon.classList.remove('invalid');
            }
        }

        function validateStep(step) {
            const stepElement = document.getElementById(`step-${step}`);
            const inputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                const wrapper = input.closest('.input-wrapper');
                const validationIcon = wrapper?.querySelector('.validation-icon');
                const errorMessage = input.parentNode.nextElementSibling;
                
                let fieldValid = true;
                
                if (!input.value.trim()) {
                    fieldValid = false;
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    fieldValid = false;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.textContent = 'Please enter a valid email address';
                    }
                }
                
                if (!fieldValid) {
                    input.classList.add('error');
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.classList.add('show');
                    }
                    if (validationIcon) {
                        validationIcon.className = 'validation-icon invalid';
                        validationIcon.innerHTML = '✕';
                    }
                    isValid = false;
                } else {
                    input.classList.remove('error');
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.classList.remove('show');
                    }
                    if (validationIcon) {
                        validationIcon.className = 'validation-icon valid';
                        validationIcon.innerHTML = '✓';
                    }
                }
            });

            return isValid;
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function updateSidebarNav() {
            for (let i = 1; i <= totalSteps; i++) {
                const navItem = document.getElementById(`nav-step-${i}`);
                
                if (i < currentStep) {
                    navItem.classList.add('completed');
                    navItem.classList.remove('active');
                } else if (i === currentStep) {
                    navItem.classList.add('active');
                    navItem.classList.remove('completed');
                } else {
                    navItem.classList.remove('active', 'completed');
                }
            }
        }

        function showStep(step) {
            document.querySelectorAll('.step').forEach(stepElement => {
                stepElement.classList.remove('active');
            });
            
            setTimeout(() => {
                document.getElementById(`step-${step}`).classList.add('active');
            }, 100);
        }

        function nextStep() {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                    updateSidebarNav();
                    
                    if (currentStep === 3) {
                        updateConfirmation();
                    }
                }
            }
        }

        function prevStep() {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                updateSidebarNav();
            }
        }

        function updateConfirmation() {
            const confirmationDetails = document.getElementById('confirmationDetails');
            const formData = new FormData(document.getElementById('multiStepForm'));
            
            const personalInfo = [
                { label: 'Full Name', value: `${formData.get('firstName')} ${formData.get('lastName')}` },
                { label: 'Email', value: formData.get('email') },
                { label: 'Phone', value: formData.get('phone') }
            ];

            const projectInfo = [
                { label: 'Project Type', value: document.getElementById('projectType').selectedOptions[0]?.text || '' },
                { label: 'Budget Range', value: document.getElementById('budget').selectedOptions[0]?.text || '' },
                { label: 'Timeline', value: document.getElementById('timeline').selectedOptions[0]?.text || '' }
            ];

            confirmationDetails.innerHTML = `
                <div class="confirmation-section">
                    <h4>Personal Information</h4>
                    ${personalInfo.map(item => `
                        <div class="confirmation-item">
                            <span class="confirmation-label">${item.label}</span>
                            <span class="confirmation-value">${item.value}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="confirmation-section">
                    <h4>Project Details</h4>
                    ${projectInfo.map(item => `
                        <div class="confirmation-item">
                            <span class="confirmation-label">${item.label}</span>
                            <span class="confirmation-value">${item.value}</span>
                        </div>
                    `).join('')}
                    <div class="confirmation-item">
                        <span class="confirmation-label">Description</span>
                        <span class="confirmation-value">${formData.get('description').substring(0, 100)}${formData.get('description').length > 100 ? '...' : ''}</span>
                    </div>
                </div>
            `;
        }

        function resetForm() {
            currentStep = 1;
            document.getElementById('multiStepForm').reset();
            document.getElementById('successState').style.display = 'none';
            showStep(1);
            updateSidebarNav();
            
            // Reset floating labels
            document.querySelectorAll('.floating-label').forEach(label => {
                label.classList.remove('active', 'filled');
            });
            
            // Clear validation states
            document.querySelectorAll('.error').forEach(element => {
                element.classList.remove('error');
            });
            document.querySelectorAll('.error-message').forEach(element => {
                element.classList.remove('show');
            });
            document.querySelectorAll('.validation-icon').forEach(icon => {
                icon.className = 'validation-icon';
            });
        }

        // Form submission
        document.getElementById('multiStepForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                const submitButton = document.querySelector('button[type="submit"]');
                submitButton.innerHTML = '<span>Submitting...</span>';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    document.getElementById('step-3').style.display = 'none';
                    document.getElementById('successState').style.display = 'block';
                    submitButton.innerHTML = 'Submit Application';
                    submitButton.disabled = false;
                }, 1500);
            }
        });

        // Initialize
        updateSidebarNav();