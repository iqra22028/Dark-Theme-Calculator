document.addEventListener('DOMContentLoaded', function() {
    const display = document.querySelector('.result');
    const buttons = document.querySelectorAll('.btn');
    
    let currentValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    
    // Update display with initial value
    updateDisplay();
    
    // Add click handlers to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Add animation class with sound effect
            button.classList.add('animate');
            playClickSound();
            
            // Apply ripple effect
            createRipple(button);
            
            // Remove animation class after animation completes
            setTimeout(() => {
                button.classList.remove('animate');
            }, 300);
            
            const value = button.textContent;
            
            if (value === 'AC') {
                clear();
            } else if (value === '⌫') {
                backspace();
            } else if (value === '+/-') {
                toggleSign();
            } else if (value === '%') {
                percentage();
            } else if ('×÷+-'.includes(value)) {
                handleOperator(value);
            } else if (value === '=') {
                calculate();
            } else if (value === '.') {
                decimal();
            } else {
                inputDigit(value);
            }
            
            updateDisplay();
        });
    });
    
    // Function to create ripple effect
    function createRipple(button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `0px`;
        ripple.style.top = `0px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add styles for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Function to play click sound
    function playClickSound() {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gain.gain.value = 0.1;
        
        oscillator.start(0);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
        oscillator.stop(context.currentTime + 0.1);
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        let buttonToPress;
        
        // Map keyboard keys to calculator buttons
        if (/[0-9]/.test(key)) {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === key);
        } else if (key === '.') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === '.');
        } else if (key === '+' || key === '-') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === key);
        } else if (key === '*') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === '×');
        } else if (key === '/') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === '÷');
            event.preventDefault(); // Prevent browser search
        } else if (key === 'Enter' || key === '=') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === '=');
            event.preventDefault();
        } else if (key === 'Escape') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === 'AC');
        } else if (key === 'Backspace') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === '⌫');
        } else if (key === '%') {
            buttonToPress = Array.from(buttons).find(btn => btn.textContent === '%');
        }
        
        if (buttonToPress) {
            // Add visual feedback for keyboard input
            buttonToPress.classList.add('animate');
            createRipple(buttonToPress);
            playClickSound();
            
            setTimeout(() => {
                buttonToPress.classList.remove('animate');
            }, 300);
            
            // Simulate click
            const event = new Event('click');
            buttonToPress.dispatchEvent(event);
        }
    });
    
    // Create moving particles in the background
    createParticles();
    
    function createParticles() {
        const calculator = document.querySelector('.calculator');
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position, size and animation delay
            const size = Math.random() * 5 + 2;
            
            particle.style.position = 'absolute';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            particle.style.borderRadius = '50%';
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.pointerEvents = 'none';
            
            // Animation
            particle.style.animation = `
                floatParticle ${Math.random() * 5 + 8}s linear infinite,
                pulseParticle ${Math.random() * 2 + 2}s ease-in-out infinite
            `;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            calculator.appendChild(particle);
        }
        
        // Add styles for particle animations
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                }
                50% {
                    transform: translateY(-30px) translateX(-10px);
                }
                75% {
                    transform: translateY(-10px) translateX(-20px);
                }
                100% {
                    transform: translateY(0) translateX(0);
                }
            }
            
            @keyframes pulseParticle {
                0%, 100% {
                    opacity: 0.2;
                }
                50% {
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }
    
    // Calculator functions
    function clear() {
        currentValue = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    }
    
    function backspace() {
        if (waitingForSecondOperand) {
            return;
        }
        
        currentValue = currentValue.toString().slice(0, -1);
        if (currentValue === '' || currentValue === '-') {
            currentValue = '0';
        }
    }
    
    function toggleSign() {
        if (currentValue === '0') {
            return;
        }
        
        currentValue = (parseFloat(currentValue) * -1).toString();
    }
    
    function percentage() {
        if (currentValue === '0') {
            return;
        }
        
        currentValue = (parseFloat(currentValue) / 100).toString();
    }
    
    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentValue = digit;
            waitingForSecondOperand = false;
        } else {
            currentValue = currentValue === '0' ? digit : currentValue + digit;
        }
    }
    
    function decimal() {
        if (waitingForSecondOperand) {
            currentValue = '0.';
            waitingForSecondOperand = false;
            return;
        }
        
        // If the currentValue does not contain a decimal point
        if (!currentValue.includes('.')) {
            currentValue += '.';
        }
    }
    
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentValue);
        
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation();
            currentValue = String(result);
            firstOperand = result;
        }
        
        waitingForSecondOperand = true;
        operator = nextOperator;
    }
    
    function performCalculation() {
        const inputValue = parseFloat(currentValue);
        
        if (operator === '+') {
            return firstOperand + inputValue;
        } else if (operator === '-') {
            return firstOperand - inputValue;
        } else if (operator === '×') {
            return firstOperand * inputValue;
        } else if (operator === '÷') {
            if (inputValue === 0) {
                // Add error shake animation
                display.textContent = "Error";
                display.classList.add('error');
                setTimeout(() => {
                    display.classList.remove('error');
                    clear();
                    updateDisplay();
                }, 1000);
                return 0;
            }
            return firstOperand / inputValue;
        }
        
        return inputValue;
    }
    
    function calculate() {
        if (!operator || firstOperand === null) {
            return;
        }
        
        const result = performCalculation();
        currentValue = String(result);
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        
        // Add animation to result
        display.classList.add('updated');
        setTimeout(() => {
            display.classList.remove('updated');
        }, 400);
    }
    
    function updateDisplay() {
        let displayValue = currentValue;
        
        // Format number for display
        if (!isNaN(displayValue)) {
            const number = parseFloat(displayValue);
            
            if (Number.isInteger(number) && !displayValue.includes('.')) {
                displayValue = number.toString();
            } else if (displayValue.endsWith('.')) {
                // Keep decimal point if it was just added
                displayValue = number.toString() + '.';
            } else {
                // For numbers with decimal places
                // If it's large or small, use scientific notation
                if (Math.abs(number) > 999999999 || (Math.abs(number) < 0.0000001 && number !== 0)) {
                    displayValue = number.toExponential(2);
                } else {
                    // Limit to 9 digits total
                    const MAX_DIGITS = 9;
                    
                    // The integer part of the number
                    const integerDigits = Math.floor(Math.abs(number)).toString().length;
                    
                    // The decimal places we can show
                    const decimalPlaces = Math.max(0, MAX_DIGITS - integerDigits);
                    
                    // Format the number
                    displayValue = number.toFixed(
                        decimalPlaces < 0 ? 0 : 
                        // Don't show trailing zeros
                        (number.toString().includes('.') ? 
                            Math.min(
                                decimalPlaces,
                                // Get actual decimal places in the number
                                number.toString().split('.')[1].length
                            ) : 0)
                    );
                    
                    // Remove trailing zeros
                    displayValue = displayValue.replace(/\.?0+$/, '');
                }
            }
        }
        
        // Error handling for display
        if (displayValue === "Error") {
            display.style.color = "#ff5252";
        } else {
            display.style.color = "white";
        }
        
        // Handle large numbers
        if (displayValue.length > 9) {
            display.style.fontSize = '40px';
        } else {
            display.style.fontSize = '64px';
        }
        
        display.textContent = displayValue;
    }
    
    // Add error shake animation style
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .error {
            animation: errorShake 0.6s ease;
            color: #ff5252 !important;
        }
    `;
    document.head.appendChild(errorStyle);
});