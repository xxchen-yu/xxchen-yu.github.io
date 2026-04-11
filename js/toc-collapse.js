// ========================================
// Stack 主题目录折叠功能
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initTocCollapse();
});

function initTocCollapse() {
    // 查找 TOC widget
    const tocWidget = document.querySelector('.left-sidebar .widget-type-toc');
    
    if (!tocWidget) return;
    
    // 创建折叠按钮
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'sidebar-toggle toc-toggle';
    toggleBtn.innerHTML = `
        <span class="toc-title">目录</span>
    `;
    
    // 获取原有的 widget 内容
    const widgetContent = tocWidget.querySelector('.widget-content');
    const widgetTitle = tocWidget.querySelector('.widget-title');
    
    // 如果有原标题，移除它
    if (widgetTitle) {
        widgetTitle.remove();
    }
    
    // 包装 widget 内容
    if (widgetContent) {
        widgetContent.classList.add('toc-content-wrapper');
    }
    
    // 插入折叠按钮
    tocWidget.insertBefore(toggleBtn, tocWidget.firstChild);
    
    // 点击事件
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        tocWidget.classList.toggle('collapsed');
        
        // 保存状态到 localStorage
        const isCollapsed = tocWidget.classList.contains('collapsed');
        localStorage.setItem('stack-toc-collapsed', isCollapsed.toString());
        
        // 触发自定义事件
        document.dispatchEvent(new CustomEvent('toc-toggle', { 
            detail: { collapsed: isCollapsed } 
        }));
    });
    
    // 恢复上次状态
    const savedState = localStorage.getItem('stack-toc-collapsed');
    if (savedState === 'true') {
        tocWidget.classList.add('collapsed');
    }
    
    // 添加滚动高亮
    initTocHighlight();
}

// TOC 滚动高亮
function initTocHighlight() {
    const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3');
    const tocLinks = document.querySelectorAll('#TableOfContents a');
    
    if (headings.length === 0 || tocLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-10% 0px -80% 0px'
    });
    
    headings.forEach(heading => observer.observe(heading));
}