import PQueue from 'p-queue';
import { inspectURL } from './gsc.functions';

/**
 * Simple automation queue for URL inspection requests.
 * Ensures we don't hit GSC rate limits and deduplicates requests.
 */

class SEOAutomation {
  private queue = new PQueue({ concurrency: 1, interval: 2000, intervalCap: 1 });
  private processedUrls = new Set<string>();

  /**
   * Schedule a URL for inspection/indexing.
   * Deduplicates by URL to avoid redundant requests in the same session.
   */
  async scheduleInspection(url: string) {
    if (this.processedUrls.has(url)) {
      console.log(`[SEO-Automation] Skipping already queued URL: ${url}`);
      return;
    }

    this.processedUrls.add(url);
    console.log(`[SEO-Automation] Queuing inspection for: ${url}`);

    return this.queue.add(async () => {
      try {
        const result = await inspectURL({ data: { url, action: "REQUEST_INDEXING" } });
        console.log(`[SEO-Automation] Success: ${url}`, result);
        return result;
      } catch (error) {
        console.error(`[SEO-Automation] Failed: ${url}`, error);
        // Remove from set so it can be retried later
        this.processedUrls.delete(url);
        throw error;
      }
    });
  }

  getQueueStatus() {
    return {
      pending: this.queue.size,
      processed: this.processedUrls.size,
      isPaused: this.queue.isPaused
    };
  }
}

export const seoAutomation = new SEOAutomation();
