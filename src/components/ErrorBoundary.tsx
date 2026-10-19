import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">حدث تنبيه أثناء تشغيل النظام</h2>
            <p className="text-sm text-slate-300">
              واجه المتصفح صعوبة في عرض محتويات الصفحة. يمكنك محاولة إعادة التحميل أو استعادة الإعدادات الافتراضية.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-950/60 rounded-lg text-xs font-mono text-red-300 text-left overflow-x-auto" dir="ltr">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-all shadow-md cursor-pointer"
              >
                إعادة تحميل الصفحة
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold text-sm transition-all cursor-pointer"
              >
                استعادة الضبط الافتراضي
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
