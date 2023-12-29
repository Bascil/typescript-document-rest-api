import { VersionRepository } from "../repositories/version.repository";

export class VersionService {
  private versionRepository: VersionRepository;

  constructor(versionRepository: VersionRepository) {
    this.versionRepository = versionRepository;
  }

  async updateVersionState(documentId: number, state: string): Promise<void> {
    await this.versionRepository.updateVersionState(documentId, state);
  }
}
