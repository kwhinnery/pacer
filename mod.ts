import { config } from "dotenv";

// Load environment variables from file
config();

const PACER_AUTH_URL = "https://pacer.login.uscourts.gov/services/cso-auth";
const PACER_PCL_URL = "https://pcl.uscourts.gov";
const PACER_USERNAME = process.env["PACER_USERNAME"];
const PACER_PASSWORD = process.env["PACER_PASSWORD"];

/**
 * Options for initializing the PACER client.
 */
interface ClientOptions {
  /**
   * The username for PACER authentication.
   */
  username?: string;

  /**
   * The password for PACER authentication.
   */
  password?: string;
}

/**
 * Options for searching a case in the PACER system.
 */
interface CaseSearchOptions {
  /**
   * The specific case number to search for.
   */
  caseNumber?: string;
}

/**
 * Represents a client for interacting with the PACER system, allowing for authentication
 * and case searching within the US court system's PACER database.
 */
export default class PACERClient {
  /** PACER website username */
  username: string;

  /** PACER website password */
  password: string;

  /** Auth token returned by the auth service */
  authToken?: string;

  /**
   * Create a new PACER client using either environment variables or passed in
   * options.
   *
   * @param options init options for the PACER Client
   */
  constructor(options?: ClientOptions) {
    this.username = options?.username || PACER_USERNAME || "";
    this.password = options?.password || PACER_PASSWORD || "";

    if (!this.username || !this.password) {
      throw new Error("PACERClient requires username and password.");
    }
  }

  /**
   * Retrieves an authentication token from the PACER authentication service.
   */
  async getToken() {
    const tokenResponse = await fetch(PACER_AUTH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginId: this.username,
        password: this.password,
      }),
    });

    const responseBody = await tokenResponse.json();
    this.authToken = responseBody.nextGenCSO;
  }

  /**
   * Searches for a case in the PACER system using a case number.
   *
   * @param options Case search options, including the case number.
   * @returns The search results as a JSON object.
   */
  // deno-lint-ignore no-explicit-any
  async findCase(options: CaseSearchOptions): Promise<any> {
    if (!this.authToken) {
      await this.getToken();
      if (!this.authToken) {
        throw new Error("Authorization credentials invalid.");
      }
    }

    const url = PACER_PCL_URL + "/pcl-public-api/rest/cases/find";
    const searchResponse = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-NEXT-GEN-CSO": this.authToken,
      },
      body: JSON.stringify({
        caseNumberFull: options.caseNumber,
      }),
    });

    const responseBody = await searchResponse.json();

    return responseBody;
  }
}
